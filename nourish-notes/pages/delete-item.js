import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import axios from 'axios';
import { useRouter } from 'next/router';
import "./delete-item.css";
import { jwtDecode } from 'jwt-decode';

const DeleteItem = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userRecipes, setUserRecipes] = useState([]);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserRecipes(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserRecipes = async (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const response = await axios.get(`http://localhost:3001/recipes/user/${userId}/recipes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserRecipes(response.data.recipes);
        } catch (error) {
            console.error('Error fetching user recipes:', error);
        }
    };

    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(`http://localhost:3001/recipes/${recipeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Refresh the list of recipes after deletion
                fetchUserRecipes(token);
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        } else {
            router.push('/login');
        }
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="delete-item">
                <h2>Delete Recipes</h2>
                <p>Which recipe(s) would you like to delete?</p>
                {userRecipes.map((recipe) => (
                    <div key={recipe._id} className="recipe-item">
                        <span>{recipe.title}</span>
                        <button onClick={() => handleDelete(recipe._id)}>Delete</button>
                    </div>
                ))}
                <Link href="/">
                    <button className="goBackButton">Cancel</button>
                </Link>
            </div>
        </div>
    );
}

export default DeleteItem;
