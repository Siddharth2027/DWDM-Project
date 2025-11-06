import { useState } from "react";
import { api } from "../api";

const options = {
  buying: ["vhigh", "high", "med", "low"],
  maint: ["vhigh", "high", "med", "low"],
  doors: ["2", "3", "4", "5more"],
  persons: ["2", "4", "more"],
  lug_boot: ["small", "med", "big"],
  safety: ["low", "med", "high"],
};

const classText = {
  unacc: "This car is UNACCEPTABLE",
  acc: "This car is ACCEPTABLE",
  good: "This car is GOOD",
  vgood: "This car is VERY GOOD",
};

const getResultCardStyle = (result) => {
  if (!result) return "";
  return (result === "unacc") ? "bad" : "good";
}

export default function PredictModel({ isEnabled }) {
  const [form, setForm] = useState({
    buying: "med",
    maint: "med",
    doors: "4",
    persons: "4",
    lug_boot: "med",
    safety: "high",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);

    try {
      const res = await api.post("/predict", form);
      setPrediction(res.data.prediction);
    } catch (err) {
      setError(err?.response?.data?.error || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const Select = ({ name }) => (
    <select name={name} value={form[name]} onChange={handleChange} required>
      {options[name].map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  );

  return (
    <div className={`card ${!isEnabled && "disabled"}`}>
      <h2>Step 2: Make a Prediction</h2>
      {!isEnabled && <p>You must train the model before you can make a prediction.</p>}
      
      <form onSubmit={handlePredict} className="form-grid">
        {Object.keys(form).map((key) => (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <Select name={key} />
          </label>
        ))}
        <button type="submit" disabled={loading || !isEnabled}>
          {loading ? "Predicting..." : "Predict Car Acceptability"}
        </button>
      </form>

      {error && <div className="error-text">{error}</div>}

      {prediction && (
        <div className={`prediction-result ${getResultCardStyle(prediction)}`}>
          <h3>{classText[prediction] || prediction}</h3>
        </div>
      )}
    </div>
  );
}
