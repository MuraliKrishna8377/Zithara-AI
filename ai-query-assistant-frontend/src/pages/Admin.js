import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Admin component for managing queries, default Q&As, and orders
const Admin = () => {
  //  State to hold all the data we need
  const [queries, setQueries] = useState([]); // Stores user queries
  const [defaultQuestions, setDefaultQuestions] = useState([]); // Stores default Q&A pairs
  const [editId, setEditId] = useState(null); // Tracks which query is being edited
  const [editQuestion, setEditQuestion] = useState(''); // Holds question during edit
  const [editAnswer, setEditAnswer] = useState(''); // Holds answer during edit
  const [defaultQuestion, setDefaultQuestion] = useState(''); // New default question input
  const [defaultAnswer, setDefaultAnswer] = useState(''); // New default answer input
  const [view, setView] = useState(null); // Controls which section is visible (default/queries)

  //  Grab the token for authentication and set up navigation
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  //  Load data when the component mounts
  useEffect(() => {
    fetchAllQueries(); // Get all user queries
    fetchDefaultQuestions(); // Get all default Q&As
  }, []);

  //  Fetch all user queries from the backend
  const fetchAllQueries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/queries/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries(res.data.queries); // Update state with fetched queries
    } catch (error) {
      console.error('Error fetching queries:', error); // Log any issues
    }
  };

  //  Fetch default questions and answers from the backend
  const fetchDefaultQuestions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/defaults`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDefaultQuestions(res.data.defaults); // Update state with default Q&As
    } catch (error) {
      console.error('Error fetching default questions:', error); // Log any issues
    }
  };

  //  Add a new default question and answer
  const handleAddDefault = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/defaults`,
        { question: defaultQuestion, answer: defaultAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDefaultQuestion(''); // Clear input
      setDefaultAnswer(''); // Clear textarea
      alert('Default question added!'); // Notify success
      fetchDefaultQuestions(); // Refresh the list
    } catch (error) {
      console.error('Error adding default question:', error); // Log any issues
    }
  };

  //  Delete a default question after confirmation
  const handleDeleteDefault = async (id) => {
    if (!window.confirm('Are you sure you want to delete this default question?')) return; // Ask for confirmation
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/defaults/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDefaultQuestions((prev) => prev.filter((item) => item._id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting default question:', error); // Log any issues
    }
  };

  //  Delete a user query after confirmation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return; // Ask for confirmation
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/queries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries((prev) => prev.filter((q) => q._id !== id)); // Remove from state
    } catch (error) {
      console.error('Delete error:', error); // Log any issues
    }
  };

  //  Start editing a query
  const handleEdit = (query) => {
    setEditId(query._id); // Set the query to edit
    setEditQuestion(query.question); // Load current question
    setEditAnswer(query.answer); // Load current answer
  };

  //  Save changes to an edited query
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/queries/${editId}`,
        {
          question: editQuestion,
          answer: editAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null); // Exit edit mode
      fetchAllQueries(); // Refresh query list
    } catch (error) {
      console.error('Update error:', error); // Log any issues
    }
  };

  //  Render the admin dashboard UI
  return (
    <div style={styles.pageWrapper}>
      {/*  Display the company logo and tagline */}
      <div style={styles.logoSection}>
        <h1 style={styles.logoText}>Zithara.AI</h1>
        <p style={styles.subLogo}>AI-Powered Customer Assistant</p>
      </div>

      {/*  Main dashboard content */}
      <div style={styles.dashboardCard}>
        <h2 style={styles.heading}>Admin Dashboard</h2>
        <p style={styles.subHeading}>Manage user queries, defaults & order statuses.</p>

        {/*  Buttons to toggle between views */}
        <div style={styles.buttonGroup}>
          <button onClick={() => setView('default')} style={styles.button}>Add Default Question</button>
          <button onClick={() => setView('queries')} style={styles.button}>View User Query History</button>
          <button onClick={() => navigate('/admin/orders')} style={styles.button}>Add Order ID and Status</button>
        </div>

        {/*  Section for adding and viewing default questions */}
        {view === 'default' && (
          <div style={styles.sectionBox}>
            <h3>Add Default Question</h3>
            <form onSubmit={handleAddDefault}>
              <input
                type="text"
                placeholder="Enter question"
                value={defaultQuestion}
                onChange={(e) => setDefaultQuestion(e.target.value)}
                style={styles.input}
                required
              />
              <textarea
                placeholder="Enter answer"
                value={defaultAnswer}
                onChange={(e) => setDefaultAnswer(e.target.value)}
                style={styles.textarea}
                required
              />
              <button type="submit" style={styles.button}>Add</button>
            </form>

            <h4 style={{ marginTop: '1rem' }}>All Default Questions</h4>
            {defaultQuestions.length === 0 ? (
              <p>No default questions yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {defaultQuestions.map((item) => (
                  <li key={item._id} style={styles.cardItem}>
                    <strong>Q:</strong> {item.question}<br />
                    <strong>A:</strong> {item.answer}<br />
                    <button onClick={() => handleDeleteDefault(item._id)} style={styles.smallButton}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/*  Section for viewing and managing user queries */}
        {view === 'queries' && (
          <div style={styles.sectionBox}>
            <h3>User Queries</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th>User</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query._id}>
                    <td>{query.userId}</td>
                    <td>
                      {editId === query._id ? (
                        <input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                      ) : (
                        query.question
                      )}
                    </td>
                    <td>
                      {editId === query._id ? (
                        <textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} />
                      ) : (
                        query.answer
                      )}
                    </td>
                    <td>
                      {editId === query._id ? (
                        <>
                          <button onClick={handleUpdate} style={styles.smallButton}>Save</button>
                          <button onClick={() => setEditId(null)} style={styles.smallButton}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(query)} style={styles.smallButton}>Edit</button>
                          <button onClick={() => handleDelete(query._id)} style={styles.smallButton}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

//  Inline styles for the admin dashboard
const styles = {
  //  Main page container
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f0f2f5', // Soft gray background
    minHeight: '100vh',
  },
  //  Logo section styling
  logoSection: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1976d2', // Vibrant blue for branding
    margin: 0,
  },
  subLogo: {
    fontSize: '1rem',
    color: '#555', // Subtle gray for tagline
    marginTop: '0.3rem',
  },
  //  Dashboard card container
  dashboardCard: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#fff', // White card background
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Soft shadow for depth
  },
  //  Heading styles
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '0.5rem',
  },
  subHeading: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '1.5rem',
  },
  //  Button group for navigation
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  //  General button styling
  button: {
    padding: '10px 18px',
    backgroundColor: '#1976d2', // Blue for primary actions
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  //  Section container
  sectionBox: {
    marginTop: '20px',
  },
  //  Input field styling
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  //  Textarea for answers
  textarea: {
    width: '100%',
    padding: '10px',
    minHeight: '60px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  //  List item for default questions
  cardItem: {
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px dashed #ccc',
  },
  //  Small action buttons
  smallButton: {
    padding: '6px 10px',
    marginTop: '5px',
    marginRight: '5px',
    fontSize: '0.8rem',
    backgroundColor: '#555', // Gray for secondary actions
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  //  Table styling
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  //  Table header row
  tableHeadRow: {
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
  },
};

export default Admin;