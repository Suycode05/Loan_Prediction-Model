import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [testUsers, setTestUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Added for mobile sidebar
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:3000'; // Updated to match backend server port

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('employeeData');

    if (!token || !userData) {
      setError('No authentication token or user data found');
      navigate('/auth');
      return;
    }

    try {
      const employee = JSON.parse(userData);
      setEmployeeData(employee);
      fetchData(token);
    } catch (error) {
      console.error('Error parsing employee data:', error);
      setError('Failed to parse employee data');
      navigate('/auth');
    }
  }, [navigate]);

  // Reset selectedUsers when activeMenuItem changes
  useEffect(() => {
    setSelectedUsers([]);
  }, [activeMenuItem]);

  const fetchData = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data with token:', token);
      const response = await fetch(`${baseUrl}/user/testdata`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Invalid or expired token');
          navigate('/auth');
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 100));
        throw new Error('Received non-JSON response from server');
      }

      const testUsersData = await response.json();
      console.log('Fetched data:', testUsersData);
      setTestUsers(testUsersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('employeeData');
    navigate('/');
  };

  const handleUserSelection = (index) => {
    setSelectedUsers((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((_, index) => index));
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    const user = filteredUsers[index];
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${baseUrl}/user/testdata/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Status: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Invalid or expired token');
          navigate('/auth');
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update testUsers with the new status
      setTestUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, Status: newStatus } : u))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const handlePredict = (index) => {
    const user = filteredUsers[index];
    if (user?._id) {
      navigate(`/predict/${user._id}`);
    } else {
      alert('User ID not found for prediction.');
    }
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const menuItems = [
    { id: 'dashboard', name: 'Pending', icon: '⏳' },
    { id: 'processed', name: 'Approved', icon: '✅' },
    { id: 'rejected', name: 'Rejected', icon: '❌' },
    { id: 'review', name: 'All Users', icon: '👥' },
  ];

  // Filter users based on activeMenuItem
  const filteredUsers = testUsers.filter((user) => {
    if (activeMenuItem === 'dashboard') return user.Status === 'pending';
    if (activeMenuItem === 'processed') return user.Status === 'approved';
    if (activeMenuItem === 'rejected') return user.Status === 'rejected';
    if (activeMenuItem === 'review') return true; // Show all users
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <div className={`w-64 bg-white shadow-xl flex-shrink-0 fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block transition-transform duration-200 ease-in-out`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">LoanPredict</h1>
        </div>
        <nav className="mt-4">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-all duration-200 hover:bg-gray-100 ${
                activeMenuItem === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-blue-600 text-white rounded-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search applicants..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {employeeData?.userid?.charAt(0)?.toUpperCase() || 'E'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium text-sm">{employeeData?.userid || 'Employee ID'}</span>
                  <span className="text-gray-500 text-xs">{employeeData?.bank || 'Bank Name'}</span>
                </div>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{Math.floor(Math.random() * 10)}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <strong className="font-semibold">Error: </strong>
                <span>{error}</span>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              {/* Table Header */}
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex items-center bg-gray-50">
                <div className="flex items-center space-x-4 w-24">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">S.No.</span>
                </div>
                <div className="grid grid-cols-6 gap-4 flex-1 text-sm font-semibold text-gray-700 min-w-[600px]">
                  <span className="ml-4">Applicant</span>
                  <span>Loan Amount</span>
                  <span>Credit Score</span>
                  <span>Annual Income</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <div className="px-4 py-8 sm:px-6 text-center text-gray-500 text-sm">
                    No {activeMenuItem === 'dashboard' ? 'pending' : activeMenuItem === 'processed' ? 'approved' : activeMenuItem === 'rejected' ? 'rejected' : 'users'} available
                  </div>
                ) : (
                  filteredUsers.map((user, index) => (
                    <div
                      key={user._id}
                      className="px-4 py-4 sm:px-6 flex items-center hover:bg-gray-50 transition-all duration-150"
                    >
                      <div className="flex items-center space-x-4 w-24 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(index)}
                          onChange={() => handleUserSelection(index)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-800 font-medium">{index + 1}</span>
                      </div>
                      <div className="grid grid-cols-6 gap-4 flex-1 text-sm min-w-[600px]">
                        <span className="text-gray-800 font-medium ml-4">Applicant {index + 1}</span>
                        <span className="text-gray-600">${user.LoanAmount.toLocaleString()}</span>
                        <span className="text-gray-600">{user.Creditscore}</span>
                        <span className="text-gray-600">${user.AnnualIncome.toLocaleString()}</span>
                        <div>
                          <select
                            value={user.Status}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="pending" className="text-gray-500">
                              Pending
                            </option>
                            <option value="approved" className="text-green-600">
                              Accept
                            </option>
                            <option value="rejected" className="text-red-600">
                              Reject
                            </option>
                          </select>
                        </div>
                        <div>
                          <button
                            onClick={() => handlePredict(index)}
                            className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                          >
                            Predict
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;