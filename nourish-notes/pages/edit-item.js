import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useRouter } from 'next/router';
import "./edit-item.css";
import { jwtDecode } from 'jwt-decode';

const EditItem = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        recipe: ''
    });
    const router = useRouter();
    const { itemId } = router.query; // Grab the item ID from the URL

    useEffect(() => {
        // Authentication check and fetch item details
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);

                try {
                    const decodedToken = jwtDecode(token);
                    const response = await axios.get(`http://localhost:3001/recipes/${itemId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFormData(response.data); // Assume the API returns the item details
                } catch (error) {
                    console.error('Error fetching recipe details:', error);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchData();
    }, [itemId, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if user is logged in
            if (!isLoggedIn) {
                alert('Please sign in to update a recipe.');
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
        
            // Prepare the data for updating, possibly no need to resend userID if it's not changing
            const updateData = {
                ...formData,
                createdBy: userId // This might not be necessary depending on your backend logic
            };
        
            // Make PUT request to update the recipe
            await axios.put(`http://localhost:3001/recipes/${formData.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}` // Include JWT token in the authorization header
                }
            });
        
            // Clear form data after successful update
            setFormData({ title: '', image: '', recipe: '' });
        
            // Alert the user that the recipe was updated successfully
            alert('Recipe updated successfully!');
            router.push('/'); // Optionally redirect the user to a different page
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    return (
        <div>
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <div className="edit-item">
            <form onSubmit={handleSubmit}>
              <h2>Edit Recipe</h2>
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
              <button type="submit">Update Recipe</button>
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

export default EditItem;
