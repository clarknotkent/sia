// src/public/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Credentials from '../private/Credentials';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === Credentials.username && password === Credentials.password) {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96 flex flex-col items-center justify-center border-2 border-black">
        <div className="w-24 h-24 bg-gray-400 rounded-full mb-4 flex items-center justify-center">
          <span className="text-white text-sm">LOGO</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 
