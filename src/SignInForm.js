import React from 'react'

export default function SignInForm({ handleSignIn, error }) {
  const [formValues, setFormValues] = React.useState({ email: '', password: '' });

  const handleUpdateForm = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInClick = async (e) => {
    e.preventDefault();
    handleSignIn(formValues);
  };

  return (
    <div className='todo-list__auth-form-container'>
      <h2>Sign In</h2>
      {error && <div className='error'>{error}</div>}
      <form
        id='signInForm'
        onSubmit={handleSignInClick}
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
            formValues.email.length === 0 || formValues.password.length === 0
          }
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
