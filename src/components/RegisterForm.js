import React from 'react'
import { useNavigate } from 'react-router';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import * as userService from '../api/userService';
import * as authService from '../api/authService';
import validator from 'validator';

export default function RegisterForm({ setLoggedIn }) {
  const usernameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  // state for loading and error handling during registration submission
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const initialState = {
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    username: {
      value: '',
      hasErrors: false,
      message: '',
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    submitCount: 0,
  };

  function registerFormReducer(draft, action) {
    switch (action.type) {
      case 'emailImmediately':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailAfterDelay':
        if (draft.email.value && !validator.isEmail(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please enter a valid email address.';
        }
        // only increment checkCount if there are no errors AND noRequest flag is not set
        // this stops the extra network call before submitting out data
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;
      case 'emailUniqueResults':
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = 'That email is already being used.';
        } else {
          draft.email.isUnique = true;
        }
        return;
      case 'usernameImmediately':
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username cannot exceed 30 characters.';
        }
        if (
          draft.username.value &&
          !validator.isAlphanumeric(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            'Username can only contain letters and numbers.';
        }
        return;
      case 'usernameAfterDelay':
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username must be at least 3 characters.';
        }
        return;
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = 'Password cannot exceed 50 characters.';
        }
        return;
      case 'passwordAfterDelay':
        if (draft.password.value.length < 6) {
          draft.password.hasErrors = true;
          draft.password.message = 'Password must be at least 6 characters.';
        }
        return;
      case 'submitForm':
        if (
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.username.hasErrors &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        return;
      default:
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(registerFormReducer, initialState);

  // all ...AfterDelay actions have if statements to check that the fields
  // contain values before running, and only dispatch if the field is not empty.
  React.useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'emailAfterDelay' }),
        800,
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value, dispatch]);

  React.useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'usernameAfterDelay' }),
        800,
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value, dispatch]);

  React.useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'passwordAfterDelay' }),
        800,
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value, dispatch]);

  // Check if email is unique
  React.useEffect(() => {
    if (state.email.checkCount) {
      async function fetchResults() {
        try {
          // response.data will be true if email exists, false if it doesn't
          const response = await userService.getUserByEmail(
            state.email.value,
            userService.cancelToken.token,
          );
          dispatch({ type: 'emailUniqueResults', value: response.data });
        } catch (error) {
          console.error(
            'There was a problem or the request was cancelled.',
            error,
          );
        }
      }
      fetchResults();
      return () => userService.cancelToken.cancel();
    }
  }, [state.email.checkCount, state.email.value, dispatch]);

  // Submit form if there are no errors and email is unique
  React.useEffect(() => {
    if (state.submitCount) {
      async function registerUser() {
        setLoading(true);
        try {
          const response = await authService.registerUser({
            email: state.email.value,
            username: state.username.value,
            password: state.password.value,
          });
          const token = response.data.token;
          localStorage.setItem('token', token);
          setLoggedIn(true);
          navigate('/');
        } catch (error) {
          setError(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
      registerUser();
      return () => authService.cancelToken.cancel();
    }
  }, [state.submitCount, state.email.value, dispatch, navigate, setLoggedIn, state.username.value, state.password.value]);

  // this function runs all validation checks immediately before submitting.
  // the actual submission is in the usue effect above that is triggered by
  // our registerFormReducer
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log('submit clicked')
    // run all validation checks before submitting
    dispatch({ type: 'emailImmediately', value: state.email.value });
    dispatch({
      type: 'emailAfterDelay',
      value: state.email.value,
      noRequest: true, // noRequest flag to skip the email uniqueness check during submission
    });
    dispatch({ type: 'usernameImmediately', value: state.username.value });
    dispatch({ type: 'usernameAfterDelay', value: state.username.value });
    dispatch({ type: 'passwordImmediately', value: state.password.value });
    dispatch({ type: 'passwordAfterDelay', value: state.password.value });
    dispatch({ type: 'submitForm' });
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='todo-list__auth-form-container'>
          <h2>Sign Up</h2>
          <p>Create an account to use your Todo List across devices</p>
          {error && <div className='error'>{error}</div>}
          <form
            id='registerForm'
            onSubmit={handleRegister}
            className='todo-list__auth-form'
          >
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              onChange={(e) =>
                dispatch({ type: 'emailImmediately', value: e.target.value })
              }
              value={state.email.value}
              autoComplete='email'
              required
            />
            <CSSTransition
              nodeRef={emailRef}
              in={state.email.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={emailRef} className='error'>
                {state.email.message}
              </div>
            </CSSTransition>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              name='username'
              type='username'
              placeholder='Username'
              onChange={(e) =>
                dispatch({ type: 'usernameImmediately', value: e.target.value })
              }
              value={state.username.value}
              autoComplete='username'
              required
            />
            <CSSTransition
              nodeRef={usernameRef}
              in={state.username.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={usernameRef} className='error'>
                {state.username.message}
              </div>
            </CSSTransition>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              onChange={(e) =>
                dispatch({ type: 'passwordImmediately', value: e.target.value })
              }
              value={state.password.value}
              autoComplete='current-password'
              required
            />
            <CSSTransition
              nodeRef={passwordRef}
              in={state.password.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={passwordRef} className='error'>
                {state.password.message}
              </div>
            </CSSTransition>
            <button
              type='submit'
              disabled={
                state.email.hasErrors ||
                state.password.hasErrors ||
                state.username.hasErrors ||
                !state.email.value ||
                !state.password.value ||
                !state.username.value
              }
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
}
