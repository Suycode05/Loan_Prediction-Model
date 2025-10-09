import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const home = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Check if user is an employee and redirect to dashboard
    const token = localStorage.getItem('authToken');
    const employeeData = localStorage.getItem('employeeData');
    
    if (token && employeeData) {
      try {
        const employee = JSON.parse(employeeData);
        if (employee.role === 'employee') {
          // Redirect employee to dashboard immediately
          navigate('/employee-dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error parsing employee data:', error);
      }
    }
  }, [navigate]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <>
     <div className="w-full flex justify-center items-center h-[400px] sm:h-[500px] lg:h-[600px] relative px-4   ">

      <img src="https://plus.unsplash.com/premium_photo-1661775362620-fc541ec56625?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="loanimage" className='h-[300px] sm:h-[400px] lg:h-[600px] w-[80vw] lg:mt-12 lg:w-[75vw]  object-cover object-center rounded-xl sm:rounded-2xl' />

      <div className='absolute h-[300px] lg:mt-12 sm:h-[500px] lg:h-[600px] w-[80vw] lg:w-[75vw] bg-gradient-to-b from-black/30 via-black/40 to-black/60 rounded-xl sm:rounded-2xl'></div>

      <div className='absolute flex flex-col items-center text-center z-10 px-4 '>
        <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-white max-w-[300px] sm:max-w-[500px] lg:max-w-[700px] leading-tight sm:leading-[1.3]'>Predict Your Loan Approval with Precision</h1>
        <h2 className='hidden sm:block text-gray-50 text-sm sm:text-base py-3 sm:py-5 max-w-[280px] sm:max-w-[500px] lg:max-w-[700px]'>Our advanced machine learning model analyzes your financial data to provide accurate loan approval predictions, helping you make informed decisions.</h2>
      <Link to="/prediction">
        <button className='bg-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-600 transition duration-300 cursor-pointer active:scale-90 text-sm sm:text-lg relative top-4 sm:top-8'>Submit Application</button>
      </Link>
      </div>
     </div>
  
   <div className="flex flex-col gap-10 lg:px-2 px-10 lg:py-20 py-0 max-w-6xl mx-auto">
  <div className="flex flex-col gap-5">
    <h1 className="text-[#0e141b] tracking-light lg:text-[32px] text-2xl font-bold max-w-[720px]">
      Why Choose LoanPredict?
    </h1>
    <p className="text-[#0e141b] text-base font-normal leading-normal max-w-[720px]">
      Our model offers unparalleled accuracy, security, and speed, ensuring you get the best possible loan prediction experience.
    </p>
  </div>
  <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
    <div className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
      <div className="text-[#0e141b]" data-icon="ChartLine" data-size="24px" data-weight="regular">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Accurate Predictions</h2>
        <p className="text-[#4e7097] text-sm font-normal leading-normal">
          Our machine learning model is trained on vast datasets to provide highly accurate loan approval predictions.
        </p>
      </div>
    </div>
    <div className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
      <div className="text-[#0e141b]" data-icon="ShieldCheck" data-size="24px" data-weight="regular">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Secure Data Handling</h2>
        <p className="text-[#4e7097] text-sm font-normal leading-normal">
          We employ state-of-the-art security measures to protect your financial data and ensure confidentiality.
        </p>
      </div>
    </div>
    <div className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
      <div className="text-[#0e141b]" data-icon="ClockCounterClockwise" data-size="24px" data-weight="regular">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Fast Results</h2>
        <p className="text-[#4e7097] text-sm font-normal leading-normal">Receive your loan prediction within minutes, allowing you to quickly assess your options.</p>
      </div>
    </div>
  </div>
</div>
<div className='max-w-6xl mx-auto flex'>
  <div className="flex flex-col  gap-6  py-10 w-full justify-center items-center">
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-[#0e141b] tracking-light lg:text-[32px] text-2xl font-bold leading-tight  max-w-[720px]">
        Ready to See Your Loan Prediction?
      </h1>
    </div> 
    <div className="flex flex-1 justify-center">
      <div className="flex justify-center">
        <Link to="/prediction">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4  bg-emerald-500 text-slate-50 text-base active:scale-90 duration-300 font-semibold  leading-normal grow">
          <span className=" ">Get Started Now</span>
        </button>
        </Link>
      </div>
    </div>
  </div>
</div>
<footer>
  <div className="flex justify-center items-center py-4 bg-gray-200">
    <p className="text-black text-sm">© 2025 LoanPredict. All rights reserved.</p>
  </div>
</footer>

 {/* N8N Chat Widget */}
      <div className={`fixed lg:bottom-6 bottom-3  lg:right-7 right-5 z-50 transition-all duration-300 ${showChat ? 'lg:w-[25vw] h-[80vh] ' : 'w-16 h-16'}`}>
        {!showChat ? (
          <button
            onClick={toggleChat}
            className="lg:w-16 lg:h-16 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Open Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,48H40A16,16,0,0,0,24,64V192a15.84,15.84,0,0,0,9.25,14.5A16.13,16.13,0,0,0,40,208a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,176H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,192V64H216V160H80a8,8,0,0,0-5.7,2.3L40,192Z" />
            </svg>
          </button>
        ) : (
          <div className="w-full h-full  bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
            <div className="bg-blue-600 text-white p-3  flex justify-between items-center flex-shrink-0">
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

</>
  )
}

export default home