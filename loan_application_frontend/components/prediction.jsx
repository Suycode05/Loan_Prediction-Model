import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Sidebar navigation component
const Sidebar = ({ currentStep, onSectionClick }) => (
  <nav className="sidebar-menu py-8 px-2 bg-[#f5f6fa] h-full min-w-[220px] flex flex-col gap-1 border-r">
    <button
      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentStep === 0 ? 'bg-[#e4ecfa] text-[#1978e5]' : 'text-gray-900 hover:text-[#1978e5] hover:bg-[#e4ecfa] cursor-pointer'
        }`}
      onClick={() => onSectionClick(0)}
      style={{ cursor: 'pointer' }}
    >
      Submit Application
    </button>
    <button
      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentStep === 1 ? 'bg-[#e4ecfa] text-[#1978e5]' : 'text-gray-900 hover:text-[#1978e5] hover:bg-[#e4ecfa] cursor-pointer'
        }`}
      onClick={() => onSectionClick(1)}
      style={{ cursor: 'pointer' }}
    >
      Select Bank
    </button>
    <button
      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentStep === 2 ? 'bg-[#e4ecfa] text-[#1978e5]' : 'text-gray-900 hover:text-[#1978e5] hover:bg-[#e4ecfa] cursor-pointer'
        }`}
      onClick={() => onSectionClick(2)}
      style={{ cursor: 'pointer' }}
    >
      Review
    </button>
  </nav>
);



// Bank list UI for "Select Bank" step
const BankSelectionTable = ({ onApply }) => {
  const banks = [
    { name: "Bank of Baroda", type: "home loan", rate: "X%", btype: "Private" },
    { name: "Indian Bank", type: "personal", rate: "X%", btype: "Government" },
    { name: "IndusInd Bank", type: "car", rate: "X%", btype: "Private" },
    { name: "Kotak Bank", type: "home", rate: "X%", btype: "Private" },
  ];
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="py-10 px-10 w-full">
      <table className="w-full border-separate border-spacing-y-2 table-fixed">
        <thead>
          <tr className="bg-[#f2f6fb] text-left">
            <th className="px-6 py-4 font-semibold">Bank Name</th>
            <th className="px-6 py-4 font-semibold">Loan TYPE</th>
            <th className="px-6 py-4 font-semibold">Intrest rate</th>
            <th className="px-6 py-4 font-semibold">Bank type</th>
            <th className="px-6 py-4 font-semibold">APPLY</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, idx) => (
            <tr key={idx} className="bg-white hover:bg-slate-50">
              <td className="px-6 py-2"><input type="checkbox" checked={selectedIndex === idx} onChange={() => setSelectedIndex(idx)} className="mr-2" />{bank.name}</td>
              <td className="px-6 py-2">{bank.type}</td>
              <td className="px-6 py-2">{bank.rate}</td>
              <td className="px-6 py-2">{bank.btype}</td>
              <td className="px-6 py-2">
                {selectedIndex === idx ? (
                  <button
                    onClick={() => onApply(bank)}
                    className="bg-green-600 hover:bg-green-700 px-5 py-1 rounded text-white font-bold text-sm"
                  >
                    APPLY NOW
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium">Select to apply</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Prediction = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);


  // Sidebar navigation state
  const [sidebarStep, setSidebarStep] = useState(0); // 0: Submit, 1: Select Bank, 2: Review
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

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
    Age: '', AnnualIncome: '', Creditscore: '', EmploymentStatus: '',
    EducationLevel: '', LoanAmount: '', LoanDuration: '',
    CreditCardUtilizationRate: '', BankruptcyHistory: false,
    PreviousLoanDefaults: false, LengthOfCreditHistory: '',
    TotalLiabilities: '', NetWorth: '', InterestRate: ''
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

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSidebarSection = (index) => {
    if (index === 1 && !formSubmitted) {
      alert('Please submit your application before selecting a bank.');
      return;
    }
    if (index === 2 && !selectedBank) {
      alert('Please apply to a bank before reviewing.');
      return;
    }
    setSidebarStep(index);
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
      const baseUrl = 'https://loan-prediction-model-eight.vercel.app/user/testdata';

      const submissionData = {
        Age: parseInt(formData.Age),
        AnnualIncome: parseFloat(formData.AnnualIncome),
        Creditscore: parseInt(formData.Creditscore),
        EmploymentStatus: formData.EmploymentStatus,    // String
        EducationLevel: formData.EducationLevel,        // String
        LoanAmount: parseFloat(formData.LoanAmount),
        LoanDuration: parseInt(formData.LoanDuration),
        CreditCardUtilizationRate: parseFloat(formData.CreditCardUtilizationRate),
        BankruptcyHistory: formData.BankruptcyHistory === 'true' || formData.BankruptcyHistory === true,
        PreviousLoanDefaults: formData.PreviousLoanDefaults === 'true' || formData.PreviousLoanDefaults === true,
        LengthOfCreditHistory: parseInt(formData.LengthOfCreditHistory),
        TotalLiabilities: parseFloat(formData.TotalLiabilities),
        NetWorth: parseFloat(formData.NetWorth),
        InterestRate: parseFloat(formData.InterestRate)
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        alert('Data submitted successfully.');
        setFormSubmitted(true);
        setSidebarStep(1);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };


  const handleApplyBank = (bank) => {
    setSelectedBank(bank);
    setSidebarStep(2); // Move to Review
  };

  return (
    <div className="flex h-screen bg-[#e4e6ef]">
      <Sidebar currentStep={sidebarStep} onSectionClick={handleSidebarSection} />
      <main className="flex-1 flex flex-col">
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
                  <span className="font-medium text-xs sm:text-sm">{userData && userData.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Content sections */}
        <div className="flex flex-1 w-full min-h-0">
          {/* Main Section */}
          <div className="flex-grow bg-white">
            {sidebarStep === 0 && (
              <div className="flex flex-col items-center pt-10 w-full">
                <h2 className="text-[#0e141b] text-[28px] font-bold text-center pb-3">Loan Prediction Form</h2>
                <p className="text-[#0e141b] text-base text-center pb-3">Fill the details below and submit application.</p>
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                  {/* Form Fields */}
                  {[
                    { name: 'Age', type: 'number', placeholder: 'Enter your age' },
                    { name: 'AnnualIncome', type: 'number', placeholder: 'Enter your annual income' },
                    { name: 'Creditscore', type: 'number', placeholder: 'Credit score (300-850)' },
                    { name: 'LoanAmount', type: 'number', placeholder: 'Loan amount' },
                    { name: 'LoanDuration', type: 'number', placeholder: 'Duration (months)' },
                    { name: 'CreditCardUtilizationRate', type: 'number', placeholder: 'Utilization rate (0-100%)' },
                    { name: 'LengthOfCreditHistory', type: 'number', placeholder: 'Credit history (years)' },
                    { name: 'TotalLiabilities', type: 'number', placeholder: 'Total liabilities' },
                    { name: 'NetWorth', type: 'number', placeholder: 'Net worth' },
                    { name: 'InterestRate', type: 'number', placeholder: 'Expected interest rate (%)' }
                  ].map(field => (
                    <div className="flex gap-4 px-4 py-2" key={field.name}>
                      <label className="flex flex-col min-w-40 flex-1">
                        <span className="text-[#0e141b] text-base font-medium pb-2">{field.name.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="form-input w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-12 p-[10px] text-base"
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                  ))}

                  {/* Employment Status */}
                  <div className="flex gap-4 px-4 py-2">
                    <label className="flex flex-col min-w-40 flex-1">
                      <span className="text-[#0e141b] text-base font-medium pb-2">Employment Status</span>
                      <select
                        name="EmploymentStatus"
                        className="form-input w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-12 p-[10px] text-base"
                        value={formData.EmploymentStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Retired">Retired</option>
                        <option value="Student">Student</option>
                      </select>
                    </label>
                  </div>

                  {/* Education Level */}
                  <div className="flex gap-4 px-4 py-2">
                    <label className="flex flex-col min-w-40 flex-1">
                      <span className="text-[#0e141b] text-base font-medium pb-2">Education Level</span>
                      <select
                        name="EducationLevel"
                        className="form-input w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-12 p-[10px] text-base"
                        value={formData.EducationLevel}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="High School">High School</option>
                        <option value="Associate">Associate Degree</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </label>
                  </div>

                  {/* Bankruptcy History */}
                  <div className="flex gap-4 px-4 py-2">
                    <label className="flex flex-col min-w-40 flex-1">
                      <span className="text-[#0e141b] text-base font-medium pb-2">Bankruptcy History</span>
                      <select
                        name="BankruptcyHistory"
                        className="form-input w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-12 p-[10px] text-base"
                        value={formData.BankruptcyHistory}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </label>
                  </div>

                  {/* Previous Loan Defaults */}
                  <div className="flex gap-4 px-4 py-2">
                    <label className="flex flex-col min-w-40 flex-1">
                      <span className="text-[#0e141b] text-base font-medium pb-2">Previous Loan Defaults</span>
                      <select
                        name="PreviousLoanDefaults"
                        className="form-input w-full rounded-lg border border-[#d0dbe7] bg-slate-50 h-12 p-[10px] text-base"
                        value={formData.PreviousLoanDefaults}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </label>
                  </div>

                  <div className="flex px-4 py-3 justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 text-slate-50 text-sm font-bold transition-all ${isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#1978e5] hover:bg-[#1565c0]'
                        }`}
                    >
                      {isLoading ? 'Predicting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Select Bank Step */}
            {sidebarStep === 1 && (
              <BankSelectionTable onApply={handleApplyBank} />
            )}

            {/* Review Step */}
            {sidebarStep === 2 && (
              <div className="flex flex-col items-center pt-20">
                <h2 className="text-[#0e141b] text-2xl font-semibold pb-2">Application Review</h2>
                <div className="max-w-xl w-full bg-[#f2f6fb] p-8 rounded-lg shadow">
                  <p className="text-gray-800 font-medium pb-1">Loan Prediction: <span className="font-bold">{predictionResult}</span></p>
                  <p className="text-gray-800 pb-1">Risk Score: <span className="font-bold">{riskScore}</span></p>
                  <p className="text-gray-800 pb-1">Bank Chosen: <span className="font-bold">{selectedBank?.name}</span></p>
                  <p className="text-gray-800 pb-1">Loan Type: <span className="font-bold">{selectedBank?.type}</span></p>
                  <p className="text-gray-800 pb-4">Interest Rate: <span className="font-bold">{selectedBank?.rate}</span></p>
                  <button
                    className="bg-[#1978e5] hover:bg-[#1565c0] text-white px-6 py-2 rounded-lg font-semibold"
                    onClick={() => alert('Final Submission Under Review!')}
                  >
                    Final Submit
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* N8N Chat Widget */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${showChat ? 'w-96 h-[600px]' : 'w-16 h-16'}`}>
        {!showChat ? (
          // Chat Button
          <button
            onClick={toggleChat}
            className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Open Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,48H40A16,16,0,0,0,24,64V192a15.84,15.84,0,0,0,9.25,14.5A16.13,16.13,0,0,0,40,208a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,176H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,192V64H216V160H80a8,8,0,0,0-5.7,2.3L40,192Z" />
            </svg>
          </button>
        ) : (
          // Chat Window
          <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h3 className="font-semibold text-sm">Loan Assistant</h3>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            </div>

            {/* Chat Content - Full height minus header */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src="https://n8n-latest-mm1b.onrender.com/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat"
                className="w-full h-full border-0"
                title="N8N Chat Assistant"
                allow="microphone; camera"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

    </div>

  );

};

export default Prediction;
