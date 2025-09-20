import React, { useState, useEffect } from 'react';
import Home from '../components/home';
import Contact from '../components/contact';
import Working from '../components/HowItWorks';
import Faq from '../components/faq';
import Result from '../components/result';
import Prediction from '../components/prediction';
import AuthLogin from '../components/AuthLogin';
import EmployeeDashboard from '../components/EmployeeDashboard';
import LoanPredictionForm from '../components/LoanPredictionForm';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const employeeData = localStorage.getItem('employeeData');
    
    console.log('🔍 Debug - Auth Check:', { token, userData, employeeData });
    
    if (token && token.trim() !== '' && (userData || employeeData)) {
      try {
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData && Object.keys(parsedUserData).length > 0) {
            console.log('✅ User authenticated:', parsedUserData);
            setIsAuthenticated(true);
            setUser(parsedUserData);
            return;
          }
        } else if (employeeData) {
          const parsedEmployeeData = JSON.parse(employeeData);
          if (parsedEmployeeData && Object.keys(parsedEmployeeData).length > 0) {
            console.log('✅ Employee authenticated:', parsedEmployeeData);
            setIsAuthenticated(true);
            setUser({ ...parsedEmployeeData, role: 'employee' });
            return;
          }
        }
      } catch (error) {
        console.error('Error parsing user/employee data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('employeeData');
      }
    }
    
    console.log('❌ User not authenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('employeeData');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    console.log('🧹 LocalStorage cleared');
    checkAuthStatus();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {location.pathname !== '/employee-dashboard' && (
        <nav className="w-full bg-gray-200 flex items-center justify-between px-5 py-2">
          <h1 className="text-black text-xl flex items-center gap-2 font-bold">
            <Link to="/" className='flex items-center gap-2'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-newspaper-icon lucide-newspaper"
              >
                <path d="M15 18h-5" />
                <path d="M18 14h-8" />
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
                <rect width="8" height="4" x="10" y="6" rx="1" />
              </svg>
              LoanPredict
            </Link>
          </h1>

          <ul className="flex space-x-4 gap-5 text-black font-semibold">
            <li>
              <Link className='hover:text-emerald-800 transition duration-300 hover:underline hidden sm:block' to="/">Home</Link>
            </li>
            <li>
              <Link className='hidden sm:block hover:text-emerald-800 transition duration-300 hover:underline' to="/working">How It Works</Link>
            </li>
            <li>
              <Link className='hidden sm:block hover:text-emerald-800 transition duration-300 hover:underline' to="/faq">FAQs</Link>
            </li>
            <li>
              <Link className='hidden sm:block hover:text-emerald-800 transition duration-300 hover:underline' to="/contact">Contact</Link>
            </li>
          </ul>

          <div className="flex items-center space-x-2">
            {!isAuthenticated && (
              <Link to="/AuthLogin">
                <button className="hidden sm:block bg-emerald-500 text-white px-2 py-1 sm:px-4 sm:py-2 h-8 sm:h-10 min-w-[100px] text-base rounded-[6px] sm:rounded-[8px] hover:bg-emerald-600 active:scale-90 transition-all duration-300 cursor-pointer">
                  Login
                </button>
              </Link>
            )}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user?.role === 'employee' ? 'Employee' : 'User'}
                </span>
                <span className="text-sm text-gray-700">
                  {user?.userid || user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <svg
            onClick={toggleMobileMenu}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block sm:hidden lucide lucide-menu-icon lucide-menu cursor-pointer hover:text-emerald-800 transition-colors"
          >
            <path d="M4 12h16" />
            <path d="M4 18h16" />
            <path d="M4 6h16" />
          </svg>
        </nav>
      )}

      {location.pathname !== '/employee-dashboard' && isMobileMenuOpen && (
        <div className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <ul className="flex flex-col py-2">
            <li>
              <Link
                className="flex px-5 py-3 text-black font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="flex px-5 py-3 text-black font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                to="/working"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                className="flex px-5 py-3 text-black font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                to="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                className="flex px-5 py-3 text-black font-semibold hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            {!isAuthenticated && (
              <li className="px-5 py-3">
                <Link to="/AuthLogin">
                  <button
                    className="w-full bg-emerald-500 text-white px-4 py-2 rounded-[6px] hover:bg-emerald-600 active:scale-95 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </button>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="px-5 py-3">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.userid || user?.name || 'User'}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-[6px] hover:bg-red-600 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/working" element={<Working />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/result" element={<Result />} />
        <Route path="/AuthLogin" element={<AuthLogin />} />
        <Route path="/auth" element={<AuthLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/predict/:id" element={<LoanPredictionForm />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </>
  );
};

export default App;