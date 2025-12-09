// App.jsx
import React, { useState } from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

const App = () => {
  // State to hold the entire user object (not just a boolean)
  const [user, setUser] = useState(null); 
  
  // The function now accepts 'userData' as an argument
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Save the user data
  };

  if (user) {
    // If 'user' is truthy (not null), render the Dashboard
    // Pass the user data DOWN to the Dashboard as a prop
    return <DashboardPage userData={user} />;
  } else {
    // Pass the navigation function DOWN to the LoginPage
    return <LoginPage onNavigate={handleLoginSuccess} />; 
  }
};

export default App;