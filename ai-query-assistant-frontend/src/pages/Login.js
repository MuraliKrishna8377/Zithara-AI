import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        Email,
        Password,
      });

      const { token, role } = res.data; // ✅ Fixed role extraction
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bg-animated">
      <style>
        {`
        /* 🟦 Page Background */
        .bg-animated {
          background-color: rgb(11, 121, 230); /* 🔁 Change this for theme */
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* 🧠 Top Corner Branding */
        .corner-logo {
          position: absolute;
          top: 20px;
          left: 30px;
          color: #333;
        }

        .corner-logo h1 {
          font-size: 24px;
          margin: 0;
          font-weight: bold;
        }

        .corner-logo p {
          margin: 0;
          font-size: 14px;
          opacity: 0.7;
        }

        /* 🪟 Login Box Styling */
        .login-box {
          background: #fff; /* 🎨 Box background color */
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
          width: 320px;
          max-width: 90%;
          text-align: center;
        }

        .welcome-text {
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 600;
          color: #444;
        }

        .login-input {
          width: 100%;
          padding: 12px 15px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 14px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #6a11cb; /* 🔁 Use #28a745 for green */
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #5311a8;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 10px;
        }
        `}
      </style>

      {/* 🌟 Branding */}
      <div className="corner-logo">
        <h1>Zithara.AI</h1>
        <p>AI-Powered Customer Assistant</p>
      </div>

      {/* 🛠️ Login Box */}
      <div className="login-box">
        <h2 className="welcome-text">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* 🧾 Register Link */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don’t have an account?{' '}
          <a href="/register" style={{ color: '#6a11cb', textDecoration: 'none' }}>
            Register here
          </a>
        </p>

        {/* ❗ Error Message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
