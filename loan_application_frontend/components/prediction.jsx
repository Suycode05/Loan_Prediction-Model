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
=======
const Sidebar = ({ currentStep, onSectionClick, isOpen, toggleSidebar }) => (
  <>
    {/* Desktop Sidebar */}
    <nav className="hidden sm:block block top-22 h-[calc(100vh+100)] w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col py-8 px-4 gap-2 z-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">Loan Application</h2>
      {['Submit Application', 'Select Bank', 'Review'].map((label, index) => (
        <button
          key={index}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
            currentStep === index
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
          }`}
          onClick={() => onSectionClick(index)}
        >
          {label}
        </button>
      ))}
    </nav>
    {/* Mobile Sidebar */}
<div
  className={`sm:hidden fixed top-0 left-0 h-full w-64 max-w-full bg-white z-50 transform transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
  <div className="flex justify-between items-center p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800">Loan Application</h2>
    <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>

    </button>
  </div>
  <nav className="flex flex-col py-4 px-4 gap-2">
    {['Submit Application', 'Select Bank', 'Review'].map((label, index) => (
      <button
        key={index}
        className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
          currentStep === index
            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
        }`}
        onClick={() => {
          onSectionClick(index);
          toggleSidebar();
        }}
      >
        {label}
      </button>
    ))}
  </nav>
</div>
  </>
);

// Bank list UI for "Select Bank" step
const BankSelectionTable = ({ onApply }) => {
  const banks = [
    { name: 'Bank of Baroda', type: 'Home Loan', rate: '6.5%', btype: 'Private' },
    { name: 'Indian Bank', type: 'Personal', rate: '7.2%', btype: 'Government' },
    { name: 'IndusInd Bank', type: 'Car', rate: '8.0%', btype: 'Private' },
    { name: 'Kotak Bank', type: 'Home', rate: '6.8%', btype: 'Private' },
  ];
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
<div className="py-8 sm:py-12 px-4 sm:px-10 w-full max-w-4xl mx-auto">
  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight">Choose Your Bank</h2>
  <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border border-gray-50/50 backdrop-blur-sm">
    <table className="w-full border-separate border-spacing-0 min-w-[360px] sm:min-w-[600px]">
      <thead>
        <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 text-gray-900 text-sm sm:text-lg font-bold">
          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left rounded-tl-2xl">Bank Name</th>
          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">Bank Type</th>
          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left rounded-tr-2xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {banks.map((bank, idx) => (
          <tr
            key={idx}
            className={`border-t border-gray-50 hover:bg-emerald-50/70 transition-all duration-300 ease-in-out ${
              selectedIndex === idx ? 'bg-emerald-100/80 shadow-inner' : ''
            }`}
          >
            <td className="px-3 sm:px-6 py-3 sm:py-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIndex === idx}
                  onChange={() => setSelectedIndex(idx)}
                  className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 text-emerald-700 focus:ring-emerald-600 border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all duration-200 focus:ring-offset-2"
                  aria-label={`Select ${bank.name}`}
                />
                <span className="text-sm sm:text-lg text-gray-900 font-semibold tracking-tight">{bank.name}</span>
              </label>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg text-gray-800 font-medium">{bank.btype}</td>
            <td className="px-3 sm:px-6 py-3 sm:py-4">
              {selectedIndex === idx ? (
                <button
                  onClick={() => {
                    console.log('Applying for:', bank);
                    onApply(bank);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                  aria-label={`Apply for ${bank.name}`}
                >
                  Apply Now
                </button>
              ) : (
                <span className="text-gray-600 text-sm sm:text-base font-medium opacity-80">Select to apply</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

const Prediction = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showChat, setShowChat] = useState(false);


  // Sidebar navigation state
  const [sidebarStep, setSidebarStep] = useState(0); // 0: Submit, 1: Select Bank, 2: Review

  const [sidebarStep, setSidebarStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [panCardNumber, setPanCardNumber] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); // Added
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' }); // Added
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false); // Added

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
    InterestRate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'BankruptcyHistory' || name === 'PreviousLoanDefaults' ? value === 'true' : value,
    }));
  };

  const handlePanCardChange = (e) => {
    setPanCardNumber(e.target.value);
  };

  const handleVerifyPanCard = async () => {
    if (!panCardNumber) {
      setToast({ show: true, message: 'Please enter a PAN card number' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
      return;
    }

    try {
      const response = await fetch('https://loan-prediction-model-eight.vercel.app/user/pancard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panCardNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          AnnualIncome: data.AnnualIncome || '',
          Creditscore: data.CreditScore || '',
          CreditCardUtilizationRate: data.CreditCardUtilizationRate || '',
          NetWorth: data.NetWorth || '',
          BankruptcyHistory: data.BankruptcyHistory || false,
          TotalLiabilities: data.TotalLiabilities || '',
          LengthOfCreditHistory: data.LengthOfCreditHistory || '',
        }));
        setToast({ show: true, message: 'PAN card verified successfully' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      } else {
        setToast({ show: true, message: 'Incorrect PAN card number' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setToast({ show: true, message: 'Network error. Please try again.' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSidebarSection = (index) => {
    if (index === 1 && !formSubmitted) {
      alert('Please submit your application before selecting a bank.');
      return;
    }
    // if (index === 2 && !selectedBank) {
    //   alert('Please apply to a bank before reviewing.');
    //   return;
    // }
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
=======
    const requiredFields = [
      'Age',
      'AnnualIncome',
      'Creditscore',
      'EmploymentStatus',
      'EducationLevel',
      'LoanAmount',
      'LoanDuration',
      'CreditCardUtilizationRate',
      'LengthOfCreditHistory',
      'TotalLiabilities',
      'NetWorth',
      'InterestRate',
    ];

    const missingFields = requiredFields.filter((field) => !formData[field] && formData[field] !== false);
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

    setIsLoading(true);
    try {
      const submissionData = {
        Age: parseInt(formData.Age),
        AnnualIncome: parseFloat(formData.AnnualIncome),
        Creditscore: parseInt(formData.Creditscore),
        EmploymentStatus: formData.EmploymentStatus,
        EducationLevel: formData.EducationLevel,
        LoanAmount: parseFloat(formData.LoanAmount),
        LoanDuration: parseInt(formData.LoanDuration),
        CreditCardUtilizationRate: parseFloat(formData.CreditCardUtilizationRate),
        BankruptcyHistory: formData.BankruptcyHistory,
        PreviousLoanDefaults: formData.PreviousLoanDefaults,
        LengthOfCreditHistory: parseInt(formData.LengthOfCreditHistory),
        TotalLiabilities: parseFloat(formData.TotalLiabilities),
        NetWorth: parseFloat(formData.NetWorth),
        InterestRate: parseFloat(formData.InterestRate),
      };
console.log(submissionData);
      const response = await fetch('https://loan-prediction-model-eight.vercel.app/user/testdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBank = (bank) => {
    setSelectedBank(bank);
    setSidebarStep(2);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleFeedbackSubmit = async () => {
    // setIsSubmittingFeedback(true);
    alert('Feedback submitted successfully!');
    // try {
    //   const response = await fetch('https://loan-prediction-model-eight.vercel.app/user/feedback', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       comment: feedback.comment,
    //       bank: selectedBank?.name || 'None',
    //       user: 'User', // Replace with actual user data
    //     }),
    //   });
    //   if (response.ok) {
    //     alert('Feedback submitted successfully!');
    //     setShowFeedbackForm(false);
    //     setFeedback({ comment: '' });
    //     setSidebarStep(0); // Reset to initial step or adjust
    //   } else {
    //     const errorData = await response.json();
    //     alert(`Error: ${errorData.error || 'Failed to submit feedback.'}`);
    //   }
    // } catch (error) {
    //   console.error('Feedback submission error:', error);
    //   alert('Network error. Please try again.');
    // } finally {
    //   setIsSubmittingFeedback(false);
    // }
    // setIsSubmittingFeedback(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <Sidebar
        currentStep={sidebarStep}
        onSectionClick={handleSidebarSection}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
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

        <div className="flex sm:hidden p-4">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 w-full min-h-0 p-6">
          <div className="flex-grow bg-white rounded-lg shadow-md p-8">
            <div className="flex-grow bg-white rounded-lg p-6 sm:p-8 max-w-3xl mx-auto">
            {sidebarStep === 0 && (
              <div className="flex flex-col w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Loan Prediction Form</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">Fill in the details below to submit your application.</p>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                      <label className="flex-1">
                        <span className="text-gray-700 text-sm font-medium mb-2 block">PAN Card Number</span>
                        <input
                          name="panCardNumber"
                          type="text"
                          placeholder="Enter your PAN card number"
                          className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={panCardNumber}
                          onChange={handlePanCardChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleVerifyPanCard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium text-sm transition-colors w-full sm:w-auto"
                      >
                        Verify PAN Card
                      </button>
                    </div>
                    {toast.show && (
                      <div
                        className={`w-full mt-2 py-2 px-4 rounded-md shadow-lg z-50 text-white font-medium text-sm transition-all duration-300 transform ${
                          toast.message === 'PAN card verified successfully'
                            ? 'bg-green-500 translate-y-0 opacity-100'
                            : 'bg-red-500 translate-y-0 opacity-100'
                        } ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                      >
                        {toast.message}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Age', type: 'number', placeholder: 'Enter your age', disabled: false },
                      { name: 'LoanAmount', type: 'number', placeholder: 'Loan amount', disabled: false },
                      { name: 'LoanDuration', type: 'number', placeholder: 'Duration (months)', disabled: false },
                      { name: 'InterestRate', type: 'number', placeholder: 'Expected interest rate (%)', disabled: false },
                      { name: 'AnnualIncome', type: 'number', placeholder: 'Annual income (auto-filled)', disabled: true },
                      { name: 'Creditscore', type: 'number', placeholder: 'Credit score (auto-filled)', disabled: true },
                      {
                        name: 'CreditCardUtilizationRate',
                        type: 'number',
                        placeholder: 'Utilization rate (auto-filled)',
                        disabled: true,
                      },
                      { name: 'LengthOfCreditHistory', type: 'number', placeholder: 'Credit history (auto-filled)', disabled: true },
                      { name: 'TotalLiabilities', type: 'number', placeholder: 'Total liabilities (auto-filled)', disabled: true },
                      { name: 'NetWorth', type: 'number', placeholder: 'Net worth (auto-filled)', disabled: true },
                    ].map((field) => (
                      <label key={field.name} className="flex flex-col">
                        <span className="text-gray-700 text-sm font-medium mb-2">
                          {field.name.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <input
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          className={`w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          disabled={field.disabled}
                          required
                        />
                      </label>
                    ))}
                    <label className="flex flex-col">
                      <span className="text-gray-700 text-sm font-medium mb-2">Employment Status</span>
                      <select
                        name="EmploymentStatus"
                        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.EmploymentStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col">
                      <span className="text-gray-700 text-sm font-medium mb-2">Education Level</span>
                      <select
                        name="EducationLevel"
                        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.EducationLevel}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {['High School', 'Associate Degree', 'Bachelor’s Degree', 'Master’s Degree', 'PhD'].map(
                          (option) => (
                            <option key={option} value={option.replace('’s', '')}>
                              {option}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <label className="flex flex-col">
                      <span className="text-gray-700 text-sm font-medium mb-2">Bankruptcy History</span>
                      <select
                        name="BankruptcyHistory"
                        className="w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-sm cursor-not-allowed"
                        value={formData.BankruptcyHistory}
                        onChange={handleInputChange}
                        disabled
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </label>
                    <label className="flex flex-col">
                      <span className="text-gray-700 text-sm font-medium mb-2">Previous Loan Defaults</span>
                      <select
                        name="PreviousLoanDefaults"
                        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}

                      className={`flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 text-slate-50 text-sm font-bold transition-all ${isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#1978e5] hover:bg-[#1565c0]'
                        }`}

                      className={`w-full sm:w-40 px-4 py-3 rounded-md text-white font-medium text-sm transition-colors ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}

                    >
                      {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {sidebarStep === 1 && <BankSelectionTable onApply={handleApplyBank} />}
{sidebarStep === 2 && (
  <div className="py-8 sm:py-12 px-4 sm:px-10 w-full max-w-4xl mx-auto">
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight">
      Application Review
    </h2>
      
      {sidebarStep === 2 && (
        <div className="mt-6 p-4 sm:p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">We Value Your Feedback</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="feedbackComment" className="block text-sm sm:text-base font-medium text-gray-800 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedbackComment"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                className="w-full h-24 p-3 text-sm sm:text-base text-gray-800 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="Share your thoughts..."
                aria-label="Feedback comments"
              />
            </div>
            <button
              onClick={handleFeedbackSubmit}
              disabled={isSubmittingFeedback}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Submit feedback"
            >
              {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>)}
      
    </div>
)}
          </div>

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