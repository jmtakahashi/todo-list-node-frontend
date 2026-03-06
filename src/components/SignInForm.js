import React from 'react'
import { useNavigate } from 'react-router';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import * as authService from '../api/authService';
import validator from 'validator';

export default function SignInForm({ setToken }) {
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  // state for loading and error handling during sign in submission
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const initialState = {
    email: {
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
        if (!draft.email.value) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please enter an email address.';
        }
        return;
      case 'emailAfterDelay':
        if (draft.email.value && !validator.isEmail(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please enter an email address.';
        }
        return;
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (!draft.password.value) {
          draft.password.hasErrors = true;
          draft.password.message = 'Please enter a password.';
        }
        return;
      case 'passwordAfterDelay':
        if (!draft.password.value) {
          draft.password.hasErrors = true;
          draft.password.message = 'Please enter a password.';
        }
        return;
      case 'submitForm':
        if (!draft.email.hasErrors && !draft.password.hasErrors) {
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
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'passwordAfterDelay' }),
        800,
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value, dispatch]);

  // Submit form if there are no errors and email is unique
  React.useEffect(() => {
    if (state.submitCount) {
      async function logInUser() {
        setLoading(true);
        try {
          const response = await authService.logInUser({
            email: state.email.value,
            password: state.password.value,
          });
          console.log(response);
          const token = response.data.token;
          setToken(token);
          navigate('/');
        } catch (error) {
          setError(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
      logInUser();
      return () => authService.cancelToken.cancel();
    }
  }, [
    state.submitCount,
    state.email.value,
    state.password.value,
    setToken,
    navigate,
  ]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    // run all validation checks before submitting
    dispatch({ type: 'emailImmediately', value: state.email.value });
    dispatch({ type: 'emailAfterDelay', value: state.email.value });
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
          <h2>Sign In</h2>
          {error && <div className='error auth-error'>{error}</div>}
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
              onChange={(e) => dispatch({ type: 'emailImmediately', value: e.target.value })}
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
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              onChange={(e) => dispatch({ type: 'passwordImmediately', value: e.target.value })}
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
                !state.email.value ||
                !state.password.value
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
