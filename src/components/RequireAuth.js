import { useLocation, Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

export default function RequireAuth() {  
  const location = useLocation();
  const accessToken = useSelector(selectToken);

  return (
    accessToken ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
  )
}
