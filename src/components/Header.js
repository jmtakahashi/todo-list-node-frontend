import React from 'react'
import { Link, useNavigate } from 'react-router';

export default function Header({ token, setToken }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/'); // Navigate to the sign-in page after signing out    
  };

  return (
    <header className='header'>
      <h1>Todo List</h1>
      <div className='todo-list__auth-buttons-container'>
        {token ? (
          <button className='todo-list__auth-button' onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <>
            <Link className='todo-list__auth-button' to='/register'>
              Register
            </Link>
            <Link className='todo-list__auth-button' to='/signin'>
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
