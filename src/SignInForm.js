import React from 'react'
import { useNavigate } from 'react-router';
import { logInUser } from './api/authService';

export default function SignInForm({ setLoggedIn }) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleUpdateForm = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await logInUser(formValues);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='todo-list__auth-form-container'>
          <h2>Sign In</h2>
          {error && <div className='error'>{error}</div>}
          <form
            id='signInForm'
            onSubmit={handleSignIn}
            className='todo-list__auth-form'
          >
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              onChange={handleUpdateForm}
              value={formValues.email}
              autoComplete='email'
              required
            />
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              onChange={handleUpdateForm}
              value={formValues.password}
              autoComplete='current-password'
              required
            />
            <button
              type='submit'
              disabled={
                formValues.email.length === 0 ||
                formValues.password.length === 0
              }
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </>
  );
}
