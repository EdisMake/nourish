import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import "./Header.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
    router.push('/'); 
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="Nourish Notes Logo" className="logo-img" /> 
      </div>
      <h1 className="welcome">Nourish Notes</h1> 
      <nav className="nav">
        <ul>
          {isLoggedIn ? (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/add-item">Add Item</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login">Log In</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
