import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setToken } from '../authSlice';
import { useCheckExistingUserMutation, useRegisterMutation } from '../authApiSlice';
import {
  selectEmail,
  selectUsername,
  selectPassword,
  selectRegisterError,
  setEmail,
  setUsername,
  setPassword,
  setEmailIsUnique,
  setEmailIsNotUnique,
  setEmailError,
  setRegisterError,
  resetState
} from './registerSlice';

export default function RegisterForm() {
  // refs for input components
  const emailInputRef = React.useRef(null);
  const usernameInputRef = React.useRef(null);
  const passwordInputRef = React.useRef(null);
  // refs for CSSTransition components
  const emailInfoRef = React.useRef(null);
  const usernameInfoRef = React.useRef(null);
  const passwordInfoRef = React.useRef(null);
  const emailErrorRef = React.useRef(null);
  const usernameErrorRef = React.useRef(null);
  const passwordErrorRef = React.useRef(null);

  // ref for error message div (not available unless an error is present)
  const errorRef = React.useRef(null);

  // email, username and password are objects containing value, hasErrors, and errorMessage properties
  const email = useSelector(selectEmail);
  const username = useSelector(selectUsername);
  const password = useSelector(selectPassword);
  const error = useSelector(selectRegisterError);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [checkExistingUser] = useCheckExistingUserMutation();
  const [registerUser, { isLoading }] = useRegisterMutation();

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

  // check for existing user when email becomes valid
  React.useEffect(() => {
    if (Boolean(email.value) && !email.hasErrors) {
      const checkEmailForUniqueness = async () => {
        try {
          const response = await checkExistingUser(email.value);
          
          const emailExists = response.data; // response.data is expected to be true if email exists, false if it doesn't
          
          if (emailExists) {
            dispatch(setEmailIsNotUnique());
          } else {
            dispatch(setEmailIsUnique());
          }
        } catch (error) {
          dispatch(setEmailError(error.data?.message || 'Failed to check for existing email. Please try again.'));
        }
      }

      checkEmailForUniqueness()
    }
  }, [email.value, email.hasErrors, checkExistingUser, dispatch]);

  const canSubmit =
    Boolean(email.value) &&
    Boolean(username.value) &&
    Boolean(password.value) &&
    !email.hasErrors &&
    !username.hasErrors &&
    !password.hasErrors &&
    !isLoading;
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        email: email.value,
        username: username.value,
        password: password.value,
      }).unwrap();
      dispatch(setToken(response.accessToken));
      dispatch(resetState());
      navigate('/todo-list');
    } catch (error) {
      dispatch(
        setRegisterError(
          error.data?.message ||
            'An error occurred during registration. Please try again.',
        ),
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='todo-list__auth-form-container'>
          <h2>Sign Up</h2>
          <p>Create an account to use your Todo List across devices</p>
          {error && (
            <div ref={errorRef} className='error auth-error'>
              {error}
            </div>
          )}
          <form
            id='registerForm'
            onSubmit={handleRegister}
            className='todo-list__auth-form'
          >
            <div className='auth-form-input-wrapper'>
              {Boolean(email.value) && !email.hasErrors && (
                <div className='auth-form-input__valid'>✅</div>
              )}
              <label htmlFor='email'>Email</label>
              <input
                ref={emailInputRef}
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                onChange={(e) => dispatch(setEmail(e.target.value))}
                value={email.value}
                autoComplete='off'
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
                ❌ {email.errorMessage}
              </div>
            </CSSTransition>
            <CSSTransition
              nodeRef={emailInfoRef}
              in={Boolean(email.value) && email.hasErrors}
              timeout={330}
              classNames='auth-form-input-message'
              unmountOnExit
            >
              <div
                ref={emailInfoRef}
                id='uidnote'
                className='auth-form-input-message'
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>Must be a valid email address.</p>
              </div>
            </CSSTransition>

            <div className='auth-form-input-wrapper'>
              {Boolean(username.value) && !username.hasErrors && (
                <div className='auth-form-input__valid'>✅</div>
              )}
              <label htmlFor='username'>Username</label>
              <input
                ref={usernameInputRef}
                id='username'
                name='username'
                type='text'
                placeholder='Username'
                onChange={(e) => dispatch(setUsername(e.target.value))}
                value={username.value}
                autoComplete='off'
                required
              />
            </div>
            <CSSTransition
              nodeRef={usernameErrorRef}
              in={username.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={usernameErrorRef} className='error'>
                ❌ {username.errorMessage}
              </div>
            </CSSTransition>
            <CSSTransition
              nodeRef={usernameInfoRef}
              in={Boolean(username.value) && username.hasErrors}
              timeout={330}
              classNames='auth-form-input-message'
              unmountOnExit
            >
              <div
                ref={usernameInfoRef}
                id='unamenote'
                className='auth-form-input-message'
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>
                  3 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, and hyphens allowed.
                </p>
              </div>
            </CSSTransition>

            <div className='auth-form-input-wrapper'>
              {Boolean(password.value) && !password.hasErrors && (
                <div className='auth-form-input__valid'>✅</div>
              )}
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
            <CSSTransition
              nodeRef={passwordErrorRef}
              in={password.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={passwordErrorRef} className='error'>
                ❌ {password.errorMessage}
              </div>
            </CSSTransition>
            <CSSTransition
              nodeRef={passwordInfoRef}
              in={Boolean(password.value) && password.hasErrors}
              timeout={330}
              classNames='auth-form-input-message'
              unmountOnExit
            >
              <div
                ref={passwordInfoRef}
                id='pwdnote'
                className='auth-form-input-message'
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{' '}
                  <span aria-label='exclamation mark'>!</span>{' '}
                  <span aria-label='at symbol'>@</span>{' '}
                  <span aria-label='hashtag'>#</span>{' '}
                  <span aria-label='dollar sign'>$</span>{' '}
                  <span aria-label='percent'>%</span>
                </p>
              </div>
            </CSSTransition>

            <button type='submit' disabled={!canSubmit}>
              {isLoading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
