import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { setToken } from '../authSlice';
import { useLoginMutation } from '../authApiSlice';
import { selectEmail, selectPassword, setEmail, setPassword, setEmailError, setLoginError, getLoginError, resetEmail } from './loginSlice';
import { EMAIL_REGEX } from '../../../utils/regex';

export default function LoginForm() {
  // refs for input components
  const emailInputRef = React.useRef(null);
  const passwordInputRef = React.useRef(null);

  // refs for CSSTransition components
  const emailRef = React.useRef(null);

  // ref for error message div (not available unless an error is present)
  const errorRef = React.useRef(null);

  // email and password are objects containing value, hasErrors, and errorMessage properties
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const error = useSelector(getLoginError);

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

// validate email on change changed
  React.useEffect(() => {
      if (email.value) {
        if (!EMAIL_REGEX.test(email.value)) {
          dispatch(setEmailError('Invalid email format'));
        } else {
          dispatch(setEmailError(''));
        }
      } else {
        dispatch(resetEmail());
      }
  }, [email.value, dispatch]);

  const canSubmit =
    Boolean(email.value) &&
    Boolean(password.value) &&
    !email.hasErrors &&
    !password.hasErrors &&
    !isLoading;

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: email.value,
        password: password.value,
      }).unwrap();
      // console.log('in LoginForm. response: ', response);
      dispatch(setToken({ token: response.accessToken }));
      dispatch(setEmail(''));
      dispatch(setPassword(''));
      dispatch(setLoginError(''));
      navigate('/todo-list');
    } catch (error) {
      console.error('in LoginForm. Error logging in user: ', error);
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
            <CSSTransition
              nodeRef={emailRef}
              in={email.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={emailRef} className='error'>
                ❌ {email.errorMessage}
              </div>
            </CSSTransition>
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
            <button type='submit' disabled={!canSubmit}>
              Log In
            </button>
          </form>
        </div>
      )}
    </>
  );
}
