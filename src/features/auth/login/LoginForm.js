import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { setToken, setPersist, selectAuthPersist } from '../authSlice';
import { useLoginMutation } from '../authApiSlice';
import {
  selectEmail,
  selectPassword,
  selectLoginError,
  setEmail,
  setPassword,
  setLoginError,
  resetState,
} from './loginSlice';

export default function LoginForm() {
  // refs for input components
  const emailInputRef = React.useRef(null);
  const passwordInputRef = React.useRef(null);

  // refs for CSSTransition components
  const emailErrorRef = React.useRef(null);

  // ref for error message div (not available unless an error is present)
  const errorRef = React.useRef(null);

  // email and password are objects containing value, hasErrors, and errorMessage properties
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const error = useSelector(selectLoginError);
  const persist = useSelector(selectAuthPersist);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  // set focus on email field when component mounts
  React.useEffect(() => {
    emailInputRef.current.focus();
  }, [emailInputRef]);

  // set focus on error field if error is present
  React.useEffect(() => {
    if (error) {
      errorRef.current.focus();
    }
  }, [error]);

  const canSubmit =
    Boolean(email.value) &&
    Boolean(password.value) &&
    !email.hasErrors &&
    !isLoading;

  // get the persist value from localStorage and set it in the Redux state on component mount
  // React.useEffect(() => {
  //   console.log('getting local storage val', localStorage.getItem('persist'));
  //   localStorage.getItem('persist') === 'true'
  //     ? console.log('persist is true') || dispatch(setPersist(true))
  //     : console.log('persist is false') || dispatch(setPersist(false));
  // }, [dispatch]);

  const togglePersist = () => {
    dispatch(setPersist(!persist));
  }

  // set the persist value in localStorage whenever it changes in the Redux state
  React.useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);
  
  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: email.value,
        password: password.value,
      }).unwrap();
      dispatch(setToken(response.accessToken));
      dispatch(resetState());
      navigate('/todo-list');
    } catch (error) {
      dispatch(setLoginError( error.data?.message || 'An error occurred during login. Please try again.' ));
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='todo-list__auth-form-container'>
          <h2>Log In</h2>
          {error && (
            <div ref={errorRef} className='error auth-error'>
              {error}
            </div>
          )}
          <form
            id='loginForm'
            onSubmit={handleLogIn}
            className='todo-list__auth-form'
          >
            <div className='auth-form-input-wrapper'>
              <label htmlFor='email'>Email</label>
              <input
                ref={emailInputRef}
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                onChange={(e) => dispatch(setEmail(e.target.value))}
                value={email.value}
                autoComplete='email'
                required
              />
            </div>
              
            <CSSTransition
              nodeRef={emailErrorRef}
              in={email.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={emailErrorRef} className='error'>
                ❌ Invalid email format
              </div>
            </CSSTransition>
              
            <div className='auth-form-input-wrapper'>
              <label htmlFor='password'>Password</label>
              <input
                ref={passwordInputRef}
                id='password'
                name='password'
                type='password'
                placeholder='Password'
                onChange={(e) => dispatch(setPassword(e.target.value))}
                value={password.value}
                autoComplete='off'
                required
              />
            </div>
              
            <div className='todo-list__persist-checkbox-container'>
              <label htmlFor='persist'>
                <input
                  type='checkbox'
                  id='persist'
                  name='persist'
                  onChange={togglePersist}
                  checked={persist}
                />
                <div className='todo-list__persist-checkbox'></div>
                Trust This Device
              </label>
            </div>
              
            <button type='submit' disabled={!canSubmit}>
              Log In
            </button>
          </form>
        </div>
      )}
    </>
  );
}
