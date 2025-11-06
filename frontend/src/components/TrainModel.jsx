import { useState } from "react";
import { api } from "../api";

const CSVSample = () => (
  <div className="sample-csv-container">
    <h3>Required CSV Format:</h3>
    <p>Your CSV file must contain these columns in any order:</p>
    <table className="sample-csv-table">
      <thead>
        <tr>
          <th>buying</th>
          <th>maint</th>
          <th>doors</th>
          <th>persons</th>
          <th>lug_boot</th>
          <th>safety</th>
          <th>class</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>vhigh</td>
          <td>vhigh</td>
          <td>2</td>
          <td>2</td>
          <td>small</td>
          <td>low</td>
          <td>unacc</td>
        </tr>
        <tr>
          <td>high</td>
          <td>med</td>
          <td>4</td>
          <td>more</td>
          <td>big</td>
          <td>high</td>
          <td>acc</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function TrainModel({ onTrainingComplete, accuracy }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrain = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("dataset", file);

    try {
      const res = await api.post("/train", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Notify parent component that training is done and pass the accuracy
      onTrainingComplete(res.data.accuracy);
    } catch (err) {
      setError(err?.response?.data?.error || "An unknown error occurred during training.");
      onTrainingComplete(null); // Reset accuracy on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Step 1: Train the Model</h2>
      <form onSubmit={handleTrain}>
        <label>
          Upload Dataset (CSV format)
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError(""); // Clear error when a new file is selected
            }}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Training... Please Wait..." : "Train Model"}
        </button>
      </form>

      {error && <div className="error-text">{error}</div>}
      
      {accuracy !== null && (
        <div className="success-text">
          <strong>Training Complete!</strong> Model Accuracy: <b>{accuracy}%</b>
        </div>
      )}

      <CSVSample />
    </div>
  );
}