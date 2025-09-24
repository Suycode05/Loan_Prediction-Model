import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [testUsers, setTestUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:3000'; // Replace with your actual API base URL

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

  const fetchData = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data with token:', token); // Debug token
      const response = await fetch(`${baseUrl}/user/testdata`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug status
      console.log('Response headers:', response.headers.get('content-type')); // Debug content type

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
        console.error('Non-JSON response received:', text.substring(0, 100)); // Log first 100 chars
        throw new Error('Received non-JSON response from server');
      }

      const testUsersData = await response.json();
      console.log('Fetched data:', testUsersData); // Debug fetched data
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
    if (selectedUsers.length === testUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(testUsers.map((_, index) => index));
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    const user = testUsers[index];
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

      setTestUsers((prev) =>
        prev.map((u, i) => (i === index ? { ...u, Status: newStatus } : u))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const handlePredict = (index) => {
    const user = testUsers[index];
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
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'pending', name: 'Pending Requests', icon: '⏳' },
    { id: 'processed', name: 'Processed', icon: '✅' },
    { id: 'review', name: 'Customer Review', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">LoanPredict</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MENU</p>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                activeMenuItem === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">👤</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium text-sm">{employeeData?.userid || 'Employee ID'}</span>
                  <span className="text-gray-500 text-xs">{employeeData?.bank || 'Bank Name'}</span>
                </div>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{Math.floor(Math.random() * 10)}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === testUsers.length && testUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Applicant</span>
                </div>
                <div className="grid grid-cols-5 gap-4 flex-1 ml-32">
                  <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                  <span className="text-sm font-medium text-gray-700">Credit Score</span>
                  <span className="text-sm font-medium text-gray-700">Annual Income</span>
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className="text-sm font-medium text-gray-700">Actions</span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {testUsers.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500">No data available</div>
                ) : (
                  testUsers.map((user, index) => (
                    <div key={user._id} className="px-6 py-4 flex items-center">
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(index)}
                          onChange={() => handleUserSelection(index)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(
                              user._id
                            )}`}
                          >
                            {user._id.substring(0, 1).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">Applicant {index + 1}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 flex-1 ml-8">
                        <span className="text-gray-600">${user.LoanAmount.toLocaleString()}</span>
                        <span className="text-gray-600">{user.Creditscore}</span>
                        <span className="text-gray-600">${user.AnnualIncome.toLocaleString()}</span>
                        <div>
                          <select
                            value={user.Status}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending" className="text-gray-500">Pending</option>
                            <option value="approved" className="text-green-600">Accept</option>
                            <option value="rejected" className="text-red-600">Reject</option>
                          </select>
                        </div>
                        <div>
                          <button
                            onClick={() => handlePredict(index)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-md text-sm font-medium transition-colors"
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