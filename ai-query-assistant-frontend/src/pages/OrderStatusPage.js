import React, { useEffect, useState } from 'react';
import axios from 'axios';

// OrderStatusPage component for managing order IDs and their statuses
const OrderStatusPage = () => {
  // State to keep track of inputs and order data
  const [orderId, setOrderId] = useState(''); // Holds the order ID input
  const [status, setStatus] = useState(''); // Holds the status input
  const [orders, setOrders] = useState([]); // Stores the list of all orders
  const token = localStorage.getItem('token'); // 🔑 Grab the authentication token

  //  Load orders when the component mounts
  useEffect(() => {
    fetchOrders(); // Fetch all orders on page load
  }, []);

  //  Fetch orders from the backend API
  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data.orders); // Update state with the fetched orders
  };

  // Add a new order with ID and status
  const handleAdd = async () => {
    await axios.post(
      'http://localhost:5000/api/admin/orders',
      {
        orderId: `#${orderId.toUpperCase()}`, // Format ID with # and uppercase
        status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrderId(''); // Clear the order ID field
    setStatus(''); // Clear the status field
    fetchOrders(); // Refresh the order list
  };

  // Delete an order by its ID
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders(); // Refresh the order list after deletion
  };

  // Render the order management UI
  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif', // Clean, readable font
        backgroundColor: '#f9f9f9', // Light background for a fresh look
        minHeight: '100vh', // Full page height
      }}
    >
      {/* Page title */}
      <h2
        style={{
          textAlign: 'center',
          color: '#333', // Dark text for contrast
        }}
      >
        Order ID Manager
      </h2>

      {/* Input fields and add button */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          margin: '1rem 0',
          justifyContent: 'center', // Center the input group
        }}
      >
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc', // Subtle border
            width: '200px', // Fixed width for consistency
          }}
        />
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '200px',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'green', 
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Add Order
        </button>
      </div>

      {/* List of orders */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          maxWidth: '600px',
          margin: '0 auto', // Center the list
        }}
      >
        {orders.map((order) => (
          <li
            key={order._id}
            style={{
              background: 'white', 
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <strong>{order.orderId}</strong>: {order.status}
            </span>
            <button
              onClick={() => handleDelete(order._id)}
              style={{
                backgroundColor: 'red', 
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderStatusPage;