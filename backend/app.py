from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)  # allow requests from React dev server

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# For safety, define expected columns (last one is target)
FEATURE_COLS = ["buying", "maint", "doors", "persons", "lug_boot", "safety"]
TARGET_COL = "class"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/train")
def train():
    """
    Accepts a CSV file via multipart form-data, trains a pipeline:
    OneHotEncoder(handle_unknown='ignore') + DecisionTreeClassifier,
    saves it as model.pkl, and returns accuracy on a holdout split.
    """
    if "dataset" not in request.files:
        return jsonify({"error": "No 'dataset' file part found."}), 400

    file = request.files["dataset"]
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Failed reading CSV: {e}"}), 400

    # basic validation
    missing = [c for c in FEATURE_COLS + [TARGET_COL] if c not in df.columns]
    if missing:
        return jsonify({"error": f"Missing columns in CSV: {missing}"}), 400

    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL].copy()

    # Encode target with LabelEncoder so pipeline outputs class indexes cleanly, but we’ll store the encoder.
    label_enc = LabelEncoder()
    y_enc = label_enc.fit_transform(y)

    # Pipeline: OneHot all features -> Decision Tree (J48-like with entropy)
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), FEATURE_COLS)
        ],
        remainder="drop"
    )

    clf = Pipeline(steps=[
        ("pre", preprocessor),
        ("model", DecisionTreeClassifier(criterion="entropy", random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.4, random_state=42, stratify=y_enc
    )

    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)

    # Save both: pipeline + label encoder (so we can map id->label back)
    bundle = {"pipeline": clf, "label_encoder": label_enc, "feature_order": FEATURE_COLS}
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(bundle, f)

    return jsonify({
        "message": "Model trained and saved.",
        "accuracy": round(acc * 100, 2),
        "model_path": "model.pkl"
    })

@app.post("/predict")
def predict():
    """
    Accepts JSON or form-data with all 6 feature fields.
    Returns predicted class label.
    """
    # load model
    if not os.path.exists(MODEL_PATH):
        return jsonify({"error": "Model not trained yet. Train first."}), 400

    with open(MODEL_PATH, "rb") as f:
        bundle = pickle.load(f)

    clf = bundle["pipeline"]
    label_enc = bundle["label_encoder"]
    feature_order = bundle["feature_order"]

    # read input (support both JSON and form)
    if request.is_json:
        data = request.get_json(silent=True) or {}
    else:
        data = request.form.to_dict()

    # ensure all features present
    missing = [c for c in feature_order if c not in data]
    if missing:
        return jsonify({"error": f"Missing inputs: {missing}"}), 400

    # build single-row DataFrame in correct order
    row = [[data[c] for c in feature_order]]
    X_new = pd.DataFrame(row, columns=feature_order)

    # predict
    pred_idx = clf.predict(X_new)[0]
    pred_label = label_enc.inverse_transform([pred_idx])[0]

    return jsonify({"prediction": pred_label})

if __name__ == "__main__":
    # flask dev server
    app.run(host="0.0.0.0", port=5000, debug=True)
