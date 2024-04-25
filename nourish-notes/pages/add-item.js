import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useRouter } from 'next/router';
import "./add-item.css";
import { jwtDecode }from 'jwt-decode';

const AddItem = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [formData, setFormData] = useState({
      title: '',
      image: '',
      recipe: ''
    });

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Check if user is logged in
        if (!isLoggedIn) {
          alert('Please sign in to add a recipe.');
          return;
        }
        
        // Get the JWT token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Token not found. Please sign in again.');
          return;
        }
    
        // Decode the token to extract user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
    
        // Include the user ID in the request body
        const data = {
          ...formData,
          createdBy: userId
        };
    
        // Make POST request to add recipe
        await axios.post('http://localhost:3001/recipes', data, {
          headers: {
            Authorization: `Bearer ${token}` // Include JWT token in the authorization header
          }
        });
    
        // Clear form data
        setFormData({ title: '', image: '', recipe: '' });
    
        // Alert the user that the recipe was saved successfully
        alert('Recipe saved successfully!');
      } catch (error) {
        console.error('Error adding recipe:', error);
      }
    };

    return (
      <div>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="add-item">
          <form onSubmit={handleSubmit}>
            <h2>Add New Recipe</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />
            <textarea
              name="recipe"
              placeholder="Recipe"
              value={formData.recipe}
              onChange={handleChange}
            />
            <button type="submit">Add Recipe</button>
          </form>
        </div>
        <div className="footer">
          <Link href="/">
            <button className="goBackButton">Go Back</button>
          </Link>
        </div>
      </div>
    );
}

export default AddItem;
