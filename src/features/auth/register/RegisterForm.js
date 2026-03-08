import React from 'react'
import { useNavigate } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../authSlice';
import { useRegisterMutation } from '../authApiSlice';
import { selectEmail, selectUsername, selectPassword, setEmail, setUsername, setPassword, getRegisterError, setError } from './registerSlice';
// import { USERNAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX} from '../../../utils/regex'

export default function RegisterForm() {
  const usernameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const errorRef = React.useRef(null);

  // email, username and password are objects containing value, hasErrors, and message properties
  const email = useSelector(selectEmail)
  const username = useSelector(selectUsername)
  const password = useSelector(selectPassword)
  const error = useSelector(getRegisterError);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();


  
  // set focus on email field when component mounts
  React.useEffect(() => {
    emailRef.current.focus();
  }, [emailRef]);

  // reset response error message when email or password changes
  React.useEffect(() => {
    dispatch(setError(''));
  }, [email.value, username.value, password.value, dispatch]);

  const canSubmit = Boolean(email.value) && Boolean(username.value) && Boolean(password.value) && !isLoading;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        email: email.value,
        username: username.value,
        password: password.value,
      }).unwrap();
      console.log('in RegisterForm. response: ', response);
      dispatch(setToken({ token: response.accessToken }));
      dispatch(setEmail(''));
      dispatch(setPassword(''));
      dispatch(setError(''));
      navigate('/');
    } catch (error) {
      console.error('in RegisterForm. Error registering user: ', error);
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
          <h2>Sign Up</h2>
          <p>Create an account to use your Todo List across devices</p>
            {error && <div ref={errorRef} className='error auth-error'>{error}</div>}
          <form
            id='registerForm'
            onSubmit={handleRegister}
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
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              name='username'
              type='username'
              placeholder='Username'
              onChange={(e) => dispatch(setUsername(e.target.value))}
              value={username.value}
              autoComplete='username'
              required
            />
            <CSSTransition
              nodeRef={usernameRef}
              in={username.hasErrors}
              timeout={330}
              classNames='auth-form-input-error-message'
              unmountOnExit
            >
              <div ref={usernameRef} className='error'>
                {username.message}
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
              Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
}
