import { useState } from "react";
import "./App.css";
import TrainModel from "./components/TrainModel";
import PredictModel from "./components/PredictModel";

export default function App() {
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [trainingAccuracy, setTrainingAccuracy] = useState(null);

  // This function will be called by TrainModel when training is complete
  const handleTrainingComplete = (accuracy) => {
    setTrainingAccuracy(accuracy);
    setIsModelTrained(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Car Evaluation Predictor</h1>
        <p>A Machine Learning project built with React and Flask</p>
      </header>

      <main>
        <TrainModel 
          onTrainingComplete={handleTrainingComplete} 
          accuracy={trainingAccuracy} 
        />
        <PredictModel isEnabled={isModelTrained} />
      </main>
    </div>
  );
}