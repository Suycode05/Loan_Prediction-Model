import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from '../components/home';
import Contact from '../components/contact';
import Working from '../components/HowItWorks';
import Faq from '../components/faq';
import Result from '../components/result';
import Prediction from '../components/prediction';
import AuthLogin from '../components/AuthLogin';
import EmployeeDashboard from '../components/EmployeeDashboard';
import LoanPredictionForm from '../components/LoanPredictionForm';

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on component mount and location change
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const employeeData = localStorage.getItem('employeeData');

    console.log('🔍 Debug - Auth Check:', { token, userData, employeeData });

    if (userData || employeeData) {
      try {
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData && Object.keys(parsedUserData).length > 0) {
            console.log('✅ User authenticated:', parsedUserData);
            setIsAuthenticated(true);
            setUser(parsedUserData);
            // Redirect to /prediction if authenticated and on /auth, /AuthLogin, or /
            if (['/auth', '/AuthLogin', '/'].includes(location.pathname)) {
              navigate('/prediction', { replace: true });
            }
            return;
          }
        } else if (employeeData) {
          const parsedEmployeeData = JSON.parse(employeeData);
          if (parsedEmployeeData && Object.keys(parsedEmployeeData).length > 0) {
            console.log('✅ Employee authenticated:', parsedEmployeeData);
            setIsAuthenticated(true);
            setUser({ ...parsedEmployeeData, role: 'employee' });
            // Redirect to /employee-dashboard if authenticated as employee
            // if (location.pathname !== '/employee-dashboard') {
            //   navigate('/employee-dashboard', { replace: true });
            // }
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

    // If not authenticated, redirect to /auth for protected routes
    console.log('❌ User not authenticated');
    setIsAuthenticated(false);
    setUser(null);
    if (['/prediction', '/result', '/predict/'].some(path => location.pathname.startsWith(path))) {
      navigate('/auth', { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('employeeData');
    setIsAuthenticated(false);
    setUser(null);
    setIsMobileMenuOpen(false);
    console.log('🚪 User logged out');
    navigate('/', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navbar: Show always except on employee dashboard */}
      {location.pathname !== '/employee-dashboard' && location.pathname !== '/prediction' && (
<nav className="w-full max-w-full bg-white shadow-md flex items-center justify-between px-3 sm:px-6 py-3">
  <h1 className="text-gray-900 text-base sm:text-xl font-bold flex items-center gap-1.5 sm:gap-3">
    <Link to="/" className="flex items-center gap-1.5 sm:gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-newspaper text-emerald-700 sm:w-5 sm:h-5"
      >
        <path d="M15 18h-5" />
        <path d="M18 14h-8" />
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
        <rect width="8" height="4" x="10" y="6" rx="1" />
      </svg>
      <span className="truncate">LoanPredict</span>
    </Link>
    {isAuthenticated && (
      <span className="ml-1 sm:ml-3 px-1.5 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-800 text-[10px] sm:text-sm font-medium rounded-full">
        <span className="sm:hidden">Portal</span>
        <span className="hidden sm:inline">User Portal</span>
      </span>
    )}
  </h1>

  <ul className="hidden sm:flex space-x-4 sm:space-x-6 text-gray-800 font-semibold text-sm sm:text-base">
    <li>
      <Link className="hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all duration-200" to="/">
        Home
      </Link>
    </li>
    <li>
      <Link className="hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all duration-200" to="/working">
        How It Works
      </Link>
    </li>
    <li>
      <Link className="hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all duration-200" to="/faq">
        FAQs
      </Link>
    </li>
    <li>
      <Link className="hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-all duration-200" to="/contact">
        Contact
      </Link>
    </li>
  </ul>

  <div className="flex items-center space-x-1.5 sm:space-x-4">
    {!isAuthenticated ? (
      <Link to="/AuthLogin">
        <button className="hidden sm:block bg-emerald-600 text-white px-2 sm:px-4 py-1 sm:py-2 h-7 sm:h-10 min-w-[70px] sm:min-w-[100px] text-[10px] sm:text-base font-semibold rounded-lg hover:bg-emerald-700 active:scale-95 transition-all duration-200">
          Login
        </button>
      </Link>
    ) : (
      <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
        <div className="text-[10px] sm:text-base text-gray-700">
          <span className="hidden sm:inline">Welcome, </span>
          <span className="font-semibold">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-1 sm:py-2 h-7 sm:h-10 rounded-lg text-[10px] sm:text-base font-semibold transition-all duration-200 active:scale-95 flex items-center space-x-1"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    )}
    <svg
      onClick={toggleMobileMenu}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block sm:hidden lucide lucide-menu cursor-pointer hover:text-emerald-600 transition-colors"
    >
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </svg>
  </div>
</nav>
      )}

{/* Mobile Menu */}
{location.pathname !== '/employee-dashboard' && isMobileMenuOpen && (
  <div
    className={`sm:hidden fixed top-0 left-0 h-[calc(100vh)] w-64 max-w-full bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="flex justify-between items-center p-3 border-b border-gray-200">
      <h2 className="text-base font-semibold text-gray-800">Menu</h2>
      <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-emerald-600">
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
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <ul className="flex flex-col py-3 px-3 gap-1.5">
      {['Home', 'How It Works', 'FAQs', 'Contact'].map((label, idx) => (
        <li key={idx}>
          <Link
            className="flex px-4 py-2 text-gray-700 font-medium text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200 rounded-md"
            to={['/', '/working', '/faq', '/contact'][idx]}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {label}
          </Link>
        </li>
      ))}
      <li className="px-4 py-2">
        {!isAuthenticated ? (
          <Link to="/AuthLogin">
            <button
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md text-[10px] font-medium hover:bg-emerald-700 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </button>
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-gray-600 truncate">Welcome, {user?.name || 'User'}</span>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-[10px] font-medium hover:bg-orange-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </li>
    </ul>
  </div>
)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/working" element={<Working />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthLogin />} />
        <Route path="/AuthLogin" element={<AuthLogin />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/result" element={<Result />} />
        <Route path="/predict/:id" element={<LoanPredictionForm />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </>
  );
};

export default App;