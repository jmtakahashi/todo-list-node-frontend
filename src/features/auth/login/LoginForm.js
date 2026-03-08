import React from 'react'
import { useNavigate } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../authSlice';
import { useLoginMutation } from '../authApiSlice';
import { selectEmail, selectPassword, setEmail, setPassword, setError, getLoginError } from './loginSlice';

export default function LoginForm() {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const errorRef = React.useRef(null);

  // email and password are objects containing value, hasErrors, and message properties
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const error = useSelector(getLoginError);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  // set focus on email field when component mounts
  React.useEffect(() => {
    emailRef.current.focus();
  }, [emailRef]);

  // reset response error message when email or password changes
  React.useEffect(() => {
    dispatch(setError(''));
  }, [email.value, password.value, dispatch]);

  const canSubmit = Boolean(email.value) && Boolean(password.value) && !isLoading;

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: email.value,
        password: password.value,
      }).unwrap();
      console.log('in LoginForm. response: ', response);
      dispatch(setToken({ token: response.accessToken }));
      dispatch(setEmail(''));
      dispatch(setPassword(''));
      dispatch(setError(''));
      navigate('/');
    } catch (error) {
      console.error('in LoginForm. Error logging in user: ', error);
      dispatch(setError({ error: error.data?.message }));
      // errorRef.current.focus();
    } finally {
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='todo-list__auth-form-container'>
          <h2>Sign In</h2>
          {error && (
            <div ref={errorRef} className='error auth-error'>
              {error}
            </div>
          )}
          <form
            id='logInForm'
            onSubmit={handleLogIn}
            className='todo-list__auth-form'
          >
            <label htmlFor='email'>Email</label>
            <input
              ref={emailRef}
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              onChange={(e) => dispatch(setEmail(e.target.value))}
              value={email.value}
              autoComplete='email'
              required
            />
            <CSSTransition
              nodeRef={emailRef}
              in={email.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={emailRef} className='error'>
                {email.message}
              </div>
            </CSSTransition>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              onChange={(e) => dispatch(setPassword(e.target.value))}
              value={password.value}
              autoComplete='current-password'
              required
            />
            <CSSTransition
              nodeRef={passwordRef}
              in={password.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={passwordRef} className='error'>
                {password.message}
              </div>
            </CSSTransition>
            <button type='submit' disabled={!canSubmit}>
              Sign In
            </button>
          </form>
        </div>
      )}
    </>
  );
}
