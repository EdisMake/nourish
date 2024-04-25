import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter to redirect after login
import axios from 'axios'; // Import Axios for making HTTP requests
import "./login-signup.css";

const Login = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: ''
    });
    const [loginError, setLoginError] = useState(false); // State to track login error
    const router = useRouter(); // Initialize router

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        // Send HTTP POST request to login endpoint
        const response = await axios.post('http://localhost:3001/users/login', formData);
        if (response.status === 200) {
          // Redirect the user to the home page if login is successful
          localStorage.setItem('token', response.data.token);
          router.push('/');
        } else {
          // If login fails, set loginError to true
          setLoginError(true);
        }
      } catch (error) {
        // If login fails due to error, set loginError to true
        setLoginError(true);
        console.error('Error logging in:', error);
      }
    };

    return (
      <div>
        <div className="login-signup">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">Login</button>
            {/* Display error message if login fails */}
            {loginError && <p className="error-message">Login failed. Please try again.</p>}
          </form>
        </div>
      </div>
    );
}

export default Login;
