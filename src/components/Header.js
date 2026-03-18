import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { selectToken, setAuthError } from '../features/auth/authSlice';

export default function Header() {
  const [logout] = useLogoutMutation();
  const location = useLocation();
  const accessToken = useSelector(selectToken);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      dispatch(setAuthError(error));
    } 
  };

  return (
    <header className='header'>
      {location.pathname === '/todo-list' ? (
        <h1 className='todo-list__title--no-link'>Todo List</h1>
      ) : (
        <Link to='/'>
          <h1>Todo List</h1>
        </Link>
      )}

      <div className='todo-list__auth-buttons-container'>
        {accessToken ? (
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
