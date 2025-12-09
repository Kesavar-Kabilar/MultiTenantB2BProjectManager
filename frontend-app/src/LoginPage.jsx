import { useState } from 'react';

const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Make the handler asynchronous to use 'await'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // 1. Define the API endpoint and request options
    const API_URL = 'http://127.0.0.1:5000/api/login'; 
    const requestBody = { email, password };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the email and password in the request body
        body: JSON.stringify(requestBody), 
      });

      console.log(response);

      // 2. Handle the response status
      if (response.ok) {
        // HTTP status is 200-299 (Success)
        // Optionally, you might process the response data (e.g., store a JWT token)
        const data = await response.json(); 
        console.log('Login successful:', data);

        // 3. Success: Navigate to the dashboard
        if (onNavigate) {
          onNavigate(data.user); // This call changes the state in App.jsx, rendering the Dashboard.
        }
      } else {
        // HTTP status is 401 (Unauthorized) or 403 (Forbidden)
        // 4. Failure: Show the specific error message
        setError('Wrong email and password');
        console.error('Login failed: Authentication error');
      }
    } catch (err) {
      // Handle network errors (e.g., server is down)
      setError('Could not connect to the server.');
      console.error('Network error during login:', err);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', 
        backgroundColor: '#f4f7f6', // Light gray background
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333' }}>Project Manager</h1>
      
      <form 
        onSubmit={handleSubmit} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px', 
          padding: '40px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          width: '300px', // Set a fixed width for the form box
        }}
      >
        
        {/* Email Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label htmlFor="email" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          />
        </div>

        {/* Password Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label htmlFor="password" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          />
        </div>

        <button 
          type="submit"
          style={{ 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginTop: '10px',
            fontWeight: 'bold',
          }}
        >
          Log In
        </button>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;