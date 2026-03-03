import React from 'react'

export default function RegisterForm({ handleRegister, error }) {
const [formValues, setFormValues] = React.useState({ email: '', username: '', password: '' });

  const handleUpdateForm = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    handleRegister(formValues);
  };

  return (
    <div className='todo-list__auth-form-container'>
      <h2>Sign Up</h2>
      <p>Create an account to use your Todo List across devices</p>
      {error && <div className='error'>{error}</div>}
      <form
        id='registerForm'
        onSubmit={handleRegisterClick}
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
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='username'
          placeholder='Username'
          onChange={handleUpdateForm}
          value={formValues.username}
          autoComplete='username'
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
            formValues.email.length === 0 || formValues.password.length === 0
          }
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
