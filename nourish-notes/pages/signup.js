import React, { useState } from 'react';
import Header from './components/Header';
import axios from 'axios'; // Import Axios for making HTTP requests
import "./login-signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
      e.preventDefault();
      try {
        // Send HTTP POST request to signup endpoint
        await axios.post('http://localhost:3001/users/register', formData);
        // Redirect the user to the login page or any other desired page
        router.push('/login');
      } catch (error) {
        console.error('Error signing up:', error);
      }
    };

    return (
      <div>
        {/* <Header /> */}
        <div className="login-signup">
          <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">Signup</button>
          </form>
        </div>
      </div>
    );
}

export default Signup;
