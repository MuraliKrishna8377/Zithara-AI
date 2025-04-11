import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [defaultQuestions, setDefaultQuestions] = useState([]);

  const token = localStorage.getItem('token');

  // pre defined default questions
  const hardcodedDefaults = [
    {
      question: 'What products does Zithara sell?',
      answer:
        'Zithara offers a range of AI-powered retail solutions including smart billing systems, customer analytics tools, and personalized marketing platforms.',
    },
    {
      question: 'What is Zithara’s refund policy?',
      answer:
        'Zithara allows refunds within 30 days of purchase for eligible products. Please retain your invoice and contact support for processing.',
    },
    {
      question: 'What services does Zithara provide?',
      answer:
        'Zithara provides AI-driven customer service tools, business insights dashboards, and inventory optimization services.',
    },
  ];

  // Fetching history and mounting default question
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_BACKEND_URL}/api/queries/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.queries);
      } catch (err) {
        console.error('Failed to fetch query history:', err);
      }
    };

    const fetchDefaults = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_BACKEND_URL}/api/admin/defaults', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDefaultQuestions(res.data.defaults);
      } catch (err) {
        console.error('Failed to fetch default questions:', err);
      }
    };

    fetchHistory();
    fetchDefaults();
  }, [token]);

  // Handles user submitting a query
  const handleAsk = async (e) => {
    e.preventDefault();

    const allDefaults = [...hardcodedDefaults, ...defaultQuestions];

    // Check for matching in default Q&A
    const matchedDefault = allDefaults.find(
      (q) => q.question.trim().toLowerCase() === query.trim().toLowerCase()
    );

    if (matchedDefault) {
      setAnswer(matchedDefault.answer);
      try {
        const res = await axios.post(
          '${process.env.REACT_APP_BACKEND_URL}/api/queries',
          {
            question: matchedDefault.question,
            answer: matchedDefault.answer,
            isDefault: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory((prev) => [res.data.query, ...prev]);
      } catch (error) {
        console.error('Error saving default query to history:', error);
      }
    } else {
      // Otherwise, send query to backend AI
      try {
        const res = await axios.post(
          '${process.env.REACT_APP_BACKEND_URL}/api/queries',
          { question: query },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // If backend indicates order ID doesn't exist
        if (res.data.message === 'Order ID not found') {
          setAnswer('There is no order ID with that value.');
        } else {
          setAnswer(res.data.query.answer);
          setHistory((prev) => [res.data.query, ...prev]);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        setAnswer('There is no order ID with that value.');
      }
    }

    setQuery('');
  };

  // Set query from default question button
  const handleDefaultClick = (q) => {
    setQuery(q);
    setAnswer('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)', // Light background gradient
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Logo and Tagline same as login.js*/}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        
        <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#3f3d56' }}>Zithara.AI</h1>
        <span style={{ marginLeft: '1rem', color: '#666', fontStyle: 'italic' }}>
          AI-Powered Customer Assistant
        </span>
      </div>

      {/* Heading of dashboard */}
      <h2 style={{ color: '#2d2d2d' }}>Welcome to the Dashboard</h2>
      <p>This is a protected route accessible after login.</p>

      {/* Query Input in tab */}
      <form onSubmit={handleAsk} style={{ marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
          required
        />
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#4c63af', // Button color
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Ask
        </button>
      </form>

      {/* Default Questions tab*/}
      <div style={{ marginTop: '2rem' }}>
        <h4>Default Questions</h4>
        {[...hardcodedDefaults, ...defaultQuestions].map((q, index) => (
          <button
            key={index}
            onClick={() => handleDefaultClick(q.question)}
            style={{
              margin: '5px',
              padding: '10px 15px',
              backgroundColor: '#e2e2f2',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {q.question}
          </button>
        ))}
      </div>

      {/* Answer tab*/}
      <div style={{ marginTop: '2rem' }}>
        <h4>Answer</h4>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '15px',
            minHeight: '120px',
            maxHeight: '300px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {answer}
        </div>
      </div>

      {/* Query History section */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Query History</h4>
        {history.length === 0 ? (
          <p>No queries yet.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <strong>Q:</strong> {item.question}
                <br />
                <strong>A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
