import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router';
import TodoList from './TodoList';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import * as authService from './api/authService';

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (formValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerUser(formValues);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }    
  }

  const handleSignIn = async (formValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.logInUser(formValues);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/signin'); // Navigate to the sign-in page after signing out  
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      {error && <div className='error'>{error}</div>}

      {loading && <div className='loading'>Loading...</div>}

      <header className='header'>
        <h1>Todo List</h1>
        <div className='todo-list__auth-buttons-container'>
          <Link className='todo-list__auth-button' to='/register'>
            Register
          </Link>
          {isLoggedIn ? (
            <button className='todo-list__auth-button' onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link className='todo-list__auth-button' to='/signin'>
              Sign In
            </Link>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<TodoList isLoggedIn={isLoggedIn} />} />
          <Route
            path='/register'
            element={<RegisterForm handleRegister={handleRegister} />}
          />
          <Route
            path='/signin'
            element={<SignInForm handleSignIn={handleSignIn} />}
          />
        </Routes>
      </main>
      <footer className='footer'>
        <span>
          Built with ❤️ by{' '}
          <a href='https://whoisjaytee.com' target='_blank' rel='noreferrer'>
            Jaytee
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
