import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import zxcvbn from 'zxcvbn';
import './App.css';

const App = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(null);

  const generatePassword = async () => {
    if (!includeUpper && !includeLower && !includeNumbers && !includeSymbols) {
      toast.error('Select at least one character type');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/generate/', {
        length,
        upper: includeUpper,
        lower: includeLower,
        numbers: includeNumbers,
        symbols: includeSymbols,
      });
      const newPassword = response.data.password;
      setPassword(newPassword);
      const strengthResult = zxcvbn(newPassword);
      setStrength(strengthResult);
      toast.success('Password generated!');
    } catch (error) {
      toast.error('Error generating password');
    }
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.write(password);
    toast.success('Password copied!');
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStrengthText = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Password Generator
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="50"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={() => setIncludeUpper(!includeUpper)}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Uppercase Letters</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={() => setIncludeLower(!includeLower)}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Lowercase Letters</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Numbers</span>
          </label>
        </div>
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Symbols</span>
          </label>
        </div>
        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Generate Password
        </button>
        {password && (
          <div className="mt-6">
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <span className="font-mono text-sm text-gray-800 break-all">
                {password}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="text-sm text-gray-700">
                  Strength: {getStrengthText(strength.score)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${getStrengthColor(
                      strength.score
                    )}`}
                    style={{ width: `${(strength.score + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;