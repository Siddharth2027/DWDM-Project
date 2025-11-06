# Car Evaluation Predictor

A user-friendly web application that uses a machine learning model to predict the acceptability of a car based on its features. This project demonstrates a full-stack application with a React frontend and a Flask (Python) backend.

![image](https://github.com/user-attachments/assets/e35c2a17-f31b-433c-879b-533595643a5f)

## Features

- **Train a Model:** Upload a CSV dataset to train a Decision Tree classifier in real-time.
- **Instant Feedback:** See the model's accuracy score immediately after training.
- **Guided UI:** A clean, modern interface that guides the user through a step-by-step process.
- **Dynamic Predictions:** Use a user-friendly form with dropdowns to input car features and get a prediction.
- **RESTful API:** A Python/Flask backend that handles model training and prediction.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python, Flask, scikit-learn, pandas
- **Styling:** Modern CSS

## Folder Structure

The project is organized into two main parts:

```
DWDM Project/
└── backend/         # Contains the Flask API and machine learning model
│   └── app.py
│   └── requirements.txt
│   └── car_evaluation.csv
│   └── model.pkl (generated after training)
│   └── venv/
└── frontend/        # Contains the React user interface
│   └── src/
│   └── package.json
│   └── ...
└── README.md
```

## Local Setup and Installation

Follow these steps to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [Python](https://www.python.org/downloads/) (v3.9 or newer) and `pip`

### 1. Backend Setup

First, set up and run the Flask API server.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Activate the virtual environment
# On Windows
..\venv\Scripts\activate

# On macOS/Linux
source ../venv/bin/activate

# 3. Install the required packages (if you haven't already)
pip install -r requirements.txt

# 4. Run the Flask server
python app.py

# The backend will now be running at http://localhost:5000
```
**Note:** Leave this terminal running.

### 2. Frontend Setup

Next, open a **new terminal** and run the React frontend.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install the required npm packages
npm install

# 3. Start the development server
npm run dev
```

The application will automatically open in your browser. If it doesn't, navigate to `http://localhost:5173` (or the port shown in your terminal).

## How to Use the Application

1.  **Train the Model:**
    - The application will load on Step 1.
    - Click the **Choose File** button and select the `car_evaluation.csv` file located in the `backend` folder.
    - Click the **Train Model** button.
    - Wait for the training to complete. The model's accuracy will be displayed.

2.  **Make a Prediction:**
    - Once the model is trained, the prediction form in Step 2 will be enabled.
    - Select the desired features for the car from the dropdown menus.
    - Click the **Predict Car Acceptability** button.
    - The prediction result will appear instantly below the form.
