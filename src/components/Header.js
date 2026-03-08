import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, setAuthError } from '../features/auth/authSlice';

export default function Header() {
  const location = useLocation();
  
  console.log('in Header. location: ', location);
  
  const [logout] = useLogoutMutation();

  const token = useSelector(getToken);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('In Header. Error occurred while logging out:', error);
      dispatch(setAuthError(error));
    }
   
  };

  return (
    <header className='header'>
      <h1>Todo List</h1>
      <div className='todo-list__auth-buttons-container'>
        {token ? (
          <button className='todo-list__auth-button' onClick={handleLogOut}>
            Sign Out
          </button>
        ) : (
          <Link
            className='todo-list__auth-button'
            to={
              location.pathname === '/' || location.pathname === '/login'
                ? '/register'
                : '/login'
            }
          >
            {location.pathname === '/' || location.pathname === '/login'
              ? 'Register'
              : 'Log In'}
          </Link>
        )}
      </div>
    </header>
  );
}
