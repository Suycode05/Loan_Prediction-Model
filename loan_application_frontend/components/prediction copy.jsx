import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Prediction = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [showResults, setShowResults] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      alert('Please login to access the prediction feature');
      navigate('/auth');
      return;
    }
    try {
      const user = JSON.parse(storedUserData);
      setUserData(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/auth');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    Age: '',
    AnnualIncome: '',
    Creditscore: '',
    EmploymentStatus: '',
    EducationLevel: '',
    LoanAmount: '',
    LoanDuration: '',
    CreditCardUtilizationRate: '',
    BankruptcyHistory: false,
    PreviousLoanDefaults: false,
    LengthOfCreditHistory: '',
    TotalLiabilities: '',
    NetWorth: '',
    InterestRate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'BankruptcyHistory' || name === 'PreviousLoanDefaults') {
      setFormData(prev => ({
        ...prev,
        [name]: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'Age', 'AnnualIncome', 'Creditscore', 'EmploymentStatus', 'EducationLevel',
      'LoanAmount', 'LoanDuration', 'CreditCardUtilizationRate', 'LengthOfCreditHistory',
      'TotalLiabilities', 'NetWorth', 'InterestRate'
    ];
    const missingFields = requiredFields.filter(field => !formData[field] && formData[field] !== false);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const baseUrl = "https://loan-prediction-model-1.onrender.com";

      const submissionData = {
        annualIncome: parseFloat(formData.AnnualIncome),
        loanDuration: parseInt(formData.LoanDuration),
        loanAmount: parseFloat(formData.LoanAmount),
        age: parseInt(formData.Age),
        creditCardUtilization: parseFloat(formData.CreditCardUtilizationRate),
        creditScore: parseInt(formData.Creditscore),
        gender: "Male", 
        married: formData.PreviousLoanDefaults ? "Yes" : "No",
        bankruptcyHistory: formData.BankruptcyHistory ? 1 : 0,
        previousLoanDefaults: formData.PreviousLoanDefaults ? 1 : 0,
        education: formData.EducationLevel,
        employmentStatus: formData.EmploymentStatus === "Employed" ? "Yes" : "No",
        propertyArea: "Urban",
        lengthOfCreditHistory: parseInt(formData.LengthOfCreditHistory),
        totalLiabilities: parseFloat(formData.TotalLiabilities),
        netWorth: parseFloat(formData.NetWorth),
        interestRate: parseFloat(formData.InterestRate)
      };

      const response = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const result = await response.json();
        setPredictionResult(result.result);
        setRiskScore(result.risk_score);
        setShowResults(false); // Reset animation
        setTimeout(() => setShowResults(true), 50); // Trigger fade-in
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      {userData && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <h1 className="hidden sm:block text-xl sm:text-2xl font-bold text-gray-900">LoanPredict</h1>
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                  <span className="sm:hidden">Portal</span>
                  <span className="hidden sm:inline">User Portal</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="hidden sm:inline">Welcome, </span>
                  <span className="font-medium text-xs sm:text-sm">{userData.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
          <h2 className="text-[#0e141b] text-[28px] font-bold text-center pb-3 pt-5">Loan Prediction Form</h2>
          <p className="text-[#0e141b] text-base text-center pb-3">Please fill in the following details to get a loan prediction.</p>
          
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            {[ 
              { name: 'Age', type: 'number', placeholder: 'Enter your age' },
              { name: 'AnnualIncome', type: 'number', placeholder: 'Enter your annual income' },
              { name: 'Creditscore', type: 'number', placeholder: 'Enter your credit score (300-850)' },
              { name: 'LoanAmount', type: 'number', placeholder: 'Enter loan amount' },
              { name: 'LoanDuration', type: 'number', placeholder: 'Enter loan duration in months' },
              { name: 'CreditCardUtilizationRate', type: 'number', placeholder: 'Enter credit card utilization rate (0-100%)' },
              { name: 'LengthOfCreditHistory', type: 'number', placeholder: 'Enter length of credit history in years' },
              { name: 'TotalLiabilities', type: 'number', placeholder: 'Enter total liabilities' },
              { name: 'NetWorth', type: 'number', placeholder: 'Enter net worth' },
              { name: 'InterestRate', type: 'number', placeholder: 'Enter expected interest rate (%)' }
            ].map(field => (
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3" key={field.name}>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">{field.name.replace(/([A-Z])/g, ' $1')}</p>
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="form-input flex w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base"
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
            ))}

            {/* Employment Status */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Employment Status</p>
                <select
                  name="EmploymentStatus"
                  className="form-input flex w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base"
                  value={formData.EmploymentStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                </select>
              </label>
            </div>

            {/* Education Level */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Education Level</p>
                <select
                  name="EducationLevel"
                  className="form-input flex w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base"
                  value={formData.EducationLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </label>
            </div>

            {/* Bankruptcy History */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Bankruptcy History</p>
                <select
                  name="BankruptcyHistory"
                  className="form-input flex w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base"
                  value={formData.BankruptcyHistory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select bankruptcy history</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            {/* Previous Loan Defaults */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Previous Loan Defaults</p>
                <select
                  name="PreviousLoanDefaults"
                  className="form-input flex w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base"
                  value={formData.PreviousLoanDefaults}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select previous loan defaults</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            <div className="flex px-4 py-3 justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 text-slate-50 text-sm font-bold transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#1978e5] hover:bg-[#1565c0]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <span>Predicting...</span>
                  </div>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-20 h-20 border-5 border-blue-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm">Analyzing your loan application...</p>
              <p className="text-gray-500 text-xs">This may take a few moments</p>
            </div>
          )}

          {/* Animated Results */}
          {!isLoading && riskScore !== null && predictionResult && (
            <div className={`mt-6 space-y-3 text-center transition-opacity duration-700 ${showResults ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-4 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                Risk Score: {riskScore}
              </div>
              <div
                className={`p-4 rounded-lg font-semibold ${
                  predictionResult === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Loan Prediction: {predictionResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Prediction;