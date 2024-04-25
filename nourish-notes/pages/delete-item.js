import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import axios from 'axios';
import { useRouter } from 'next/router';
import "./delete-item.css";
import { jwtDecode } from 'jwt-decode';

const DeleteItem = () => {
    const router = useRouter();
    const { itemId } = router.query;
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [router]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                await axios.delete(`http://localhost:3001/recipes/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                router.push('/');
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
            <h2>Delete Recipe</h2>
            <p>Are you sure you want to delete this recipe?</p>
            <button onClick={handleDelete}>Delete Recipe</button>
            <Link href="/">
              <button className="goBackButton">Cancel</button>
            </Link>
          </div>
        </div>
    );
}

export default DeleteItem;
