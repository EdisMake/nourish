import React, { useState, useEffect } from 'react';
import Header from './components/Header'; 
import Item from './components/Item';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useRouter } from 'next/router'; 
import "./index.css";
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserRecipes(token);
    } else {
      setIsLoggedIn(false);
      // If the user is not logged in, display the dummy recipes
      setUserRecipes([
        { id: 1, title: 'Eggs', imageUrl: 'https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg', recipe: '- 3x Eggs' },
        { id: 2, title: 'Pizza', imageUrl: 'pizza.jpg', recipe: '- Dough - Marinara Sauce - Cheese' },
        { id: 3, title: 'Lasagna', imageUrl: 'lasagna.jpg', recipe: '- Lasagna' }
      ]);
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

  const handleAddRecipe = () => {
    router.push('/add-item');
  };

  // Function to handle editing a recipe
  const handleEditRecipe = (id) => {
    router.push(`/edit-item`);
  };

  const handleDeleteRecipe = () => {
    router.push(`/delete-item`);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="content"> 
        {userRecipes.map((recipe, index) => (
          <Item 
            key={index} 
            item={recipe} 
            onEdit={() => handleEditRecipe()} 
            onDelete={() => handleDeleteRecipe()} 
          />
        ))}
      </div>
      {isLoggedIn && (
        <div className="buttons-container">
          <button className="button" onClick={handleAddRecipe}>Add A Recipe</button>
          <button className="button" onClick={handleEditRecipe}>Edit A Recipe</button>
          <button className="button" onClick={handleDeleteRecipe}>Delete A Recipe</button>
        </div>
      )}
    </div>
  );
}

export default Home;
