from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
import pandas as pd
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
# Explicitly allow localhost:5173 (Vite) and all origins for testing
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "*"]}})

# Load the trained classifier model
try:
    with open('model/load_model.pkl', 'rb') as f:
        model = pickle.load(f)
    app.logger.info("Model loaded successfully.")
except FileNotFoundError:
    app.logger.error("Model file not found! Ensure 'model/load_model.pkl' is in the correct directory.")
    model = None

@app.route('/', methods=['GET', 'OPTIONS'])
def health_check():
    app.logger.info("Health check endpoint was hit.")
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    return jsonify({"status": "ok", "message": "Loan Prediction Server is running"}), 200

@app.route('/user/testdata/<id>', methods=['GET', 'OPTIONS'])
def get_user_data(id):
    app.logger.info(f"Fetching test data for ID: {id}")
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    # Mock data (add more IDs if needed)
    if id in ['68c2fc14a548b030a48bcc1f', '68c30974b9e7b20bd402aef8']:
        return jsonify({
            'Age': 30,
            'AnnualIncome': 50000,
            'Creditscore': 720,
            'EmploymentStatus': 'Employed',
            'EducationLevel': 'Bachelor',
            'LoanAmount': 10000,
            'LoanDuration': 12,
            'CreditCardUtilizationRate': 30,
            'BankruptcyHistory': False,
            'PreviousLoanDefaults': False,
            'LengthOfCreditHistory': 5,
            'TotalLiabilities': 20000,
            'NetWorth': 50000,
            'InterestRate': 5.5
        })
    return jsonify({'error': 'User not found'}), 404

def calculate_risk_score(data):
    try:
        age_factor = (int(data['Age']) - 18) / (100 - 18)
        income_factor = float(data['AnnualIncome']) / 100000
        credit_score_factor = (int(data['Creditscore']) - 300) / (850 - 300)
        loan_amount_factor = float(data['LoanAmount']) / 500000
        loan_duration_factor = int(data['LoanDuration']) / 360
        utilization_factor = float(data['CreditCardUtilizationRate']) / 100
        bankruptcy_factor = 1 if data['BankruptcyHistory'] else 0
        default_factor = 1 if data['PreviousLoanDefaults'] else 0
        credit_history_factor = int(data['LengthOfCreditHistory']) / 50
        liabilities_factor = float(data['TotalLiabilities']) / 1000000
        networth_factor = float(data['NetWorth']) / 1000000
        interest_rate_factor = float(data['InterestRate']) / 100

        risk_score = (
            0.15 * (1 - credit_score_factor) + 0.10 * utilization_factor +
            0.10 * bankruptcy_factor + 0.10 * default_factor +
            0.05 * loan_amount_factor + 0.05 * loan_duration_factor +
            0.05 * liabilities_factor + 0.05 * interest_rate_factor +
            0.05 * (1 - income_factor) + 0.05 * (1 - networth_factor) +
            0.05 * (1 - credit_history_factor) + 0.05 * (1 - age_factor)
        )
        return max(0, min(risk_score * 100, 100))
    except Exception as e:
        raise ValueError(f"Error in risk score calculation: {str(e)}")

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    app.logger.info("'/predict' endpoint was hit.")
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    if model is None:
        app.logger.error("Model is not loaded, cannot make a prediction.")
        return jsonify({'error': 'Model is not available on the server'}), 500

    data = request.get_json()
    if not data:
        app.logger.warning("No data received in the request.")
        return jsonify({'error': 'No data provided'}), 400
        
    try:
        app.logger.info(f"Received data for prediction: {data}")
        risk_score = calculate_risk_score(data)
        X = pd.DataFrame([[risk_score]], columns=['RiskScore'])
        prediction = model.predict(X)[0]
        proba = model.predict_proba(X)[0][1]
        result = 'Approved' if prediction == 1 else 'Rejected'

        app.logger.info(f"Prediction successful: Risk Score={risk_score}, Result={result}")
        return jsonify({
            'risk_score': round(risk_score, 2),
            'result': result,
            'approval_probability': round(proba, 2)
        })

    except Exception as e:
        app.logger.error(f"An error occurred during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)