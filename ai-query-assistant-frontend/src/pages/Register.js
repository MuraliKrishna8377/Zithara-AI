import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    Username: '',
    Email: '',
    Password: '',
    Role: 'Customer',
    adminCode: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', // Light gray background (alternative: '#e9eff5', '#fafafa')
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top-left Logo and Tagline */}
      <div style={{ padding: '1rem' }}>
        <h1
          style={{
            margin: 0,
            color: '#ff4d4f', // Logo text color (alternative: '#e63946', '#ff3b3f')
            fontSize: '1.7rem',
            fontWeight: 'bold',
          }}
        >
          Zithara.AI
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#555', // Tagline text color (alternative: '#666', '#444')
          }}
        >
          AI-Powered Customer Assistant
        </p>
      </div>

      {/* Centered Form Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center', // Horizontally center the form
          alignItems: 'center', // Vertically center the form
        }}
      >
        {/* Registration Card */}
        <div
          style={{
            backgroundColor: '#ffffff', // Card background (alternative: '#f9f9f9', '#fffefa')
            padding: '2rem',
            borderRadius: '12px', // Rounded corners (alternative: '8px', '16px')
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Shadow effect (alternative: '0 0 15px rgba(0,0,0,0.15)')
            width: '340px', // Card width (adjust as needed)
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <input
              type="text"
              name="Username"
              placeholder="Username"
              value={form.Username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem',
                marginBottom: '1rem',
                borderRadius: '6px', // Rounded input (alternative: '4px', '10px')
                border: '1px solid #ccc', // Border style (alternative: '#bbb', 'none')
              }}
            />

            {/* Email Field */}
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={form.Email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />

            {/* Password Field */}
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={form.Password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />

            {/* Role Selection */}
            <select
              name="Role"
              value={form.Role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            {/* Admin Code Input (only if Admin role is selected) */}
            {form.Role === 'Admin' && (
              <input
                type="text"
                name="adminCode"
                placeholder="Enter Admin Code"
                value={form.adminCode}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  marginBottom: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.7rem',
                backgroundColor: '#ff4d4f', // Button background (alternative: '#e74c3c', '#d63031')
                color: '#fff', // Button text color
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Register
            </button>
          </form>

          {/* Display Error (if any) */}
          {error && (
            <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
          )}

          {/* Login Link for Existing Users */}
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{
                color: '#ff4d4f', // Link color (alternative: '#e74c3c', '#d63031')
                cursor: 'pointer',
              }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;