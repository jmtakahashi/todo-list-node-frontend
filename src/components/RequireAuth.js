import { useLocation, Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux';
import { getToken } from '../features/auth/authSlice';

export default function RequireAuth() {  
  const location = useLocation();
  const accessToken = useSelector(getToken);

  console.log('in RequireAuth accessToken: ', accessToken);

  return (
    accessToken ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
  )
}
