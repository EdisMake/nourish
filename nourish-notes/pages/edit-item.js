import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useRouter } from 'next/router';
import "./edit-item.css";
import { jwtDecode } from 'jwt-decode';

const EditItem = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRecipes, setUserRecipes] = useState([]);
    const [editFormData, setEditFormData] = useState({
        title: '',
        image: '',
        recipe: ''
    });
    const [editingRecipeId, setEditingRecipeId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserRecipes(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Function to fetch user's recipes
    const fetchUserRecipes = async (token) => {
        try {
            // Decode the token to get user ID
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            // Make GET request to fetch user's recipes
            const response = await axios.get(`http://localhost:3001/recipes/user/${userId}/recipes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserRecipes(response.data.recipes); // Set user's recipes in state
        } catch (error) {
            console.error('Error fetching user recipes:', error);
        }
    };

    // Function to handle editing a recipe
    const handleEditRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Fetch the recipe details by recipeId
                const response = await axios.get(`http://localhost:3001/recipes/${recipeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { title, image, recipe } = response.data;
                setEditFormData({ title, image, recipe }); // Populate the form data with the fetched recipe details
                setEditingRecipeId(recipeId); // Set the editing recipe ID
            }
        } catch (error) {
            console.error('Error fetching recipe details for editing:', error);
        }
    };    

    const handleChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Make PUT request to update the recipe
                await axios.put(`http://localhost:3001/recipes/${editingRecipeId}`, editFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Recipe updated successfully!');
                router.push('/'); // Redirect the user to a different page after successful update
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="edit-item">
                {userRecipes.map((recipe) => (
                    <div key={recipe._id} className="recipe-item">
                        <h3>{recipe.title}</h3>
                        <button onClick={() => handleEditRecipe(recipe._id)}>Edit</button>
                    </div>
                ))}
                {editingRecipeId && (
                    <form onSubmit={handleSubmit}>
                        <h2>Edit Recipe</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={editFormData.title}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="image"
                            placeholder="Image URL"
                            value={editFormData.image}
                            onChange={handleChange}
                        />
                        <textarea
                            name="recipe"
                            placeholder="Recipe"
                            value={editFormData.recipe}
                            onChange={handleChange}
                        />
                        <button type="submit">Update Recipe</button>
                    </form>
                )}
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
