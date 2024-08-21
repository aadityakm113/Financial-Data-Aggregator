import React from 'react';

const Login = ({ onLoginSuccess }) => {
  const handleGoogleLogin = () => {
    // Handle Google login and obtain a token
    const token = "sampleGoogleAuthToken";
    onLoginSuccess(token);
  };

  const handleFormLogin = () => {
    // Handle form login and obtain a token
    const token = "sampleFormAuthToken";
    onLoginSuccess(token);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to FinDAGG</h1>
        <h2 className="text-xl text-gray-600 text-center mb-6">Login to continue</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleFormLogin}
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <button 
            className="text-blue-500 hover:underline"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
