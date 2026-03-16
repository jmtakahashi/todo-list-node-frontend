import React from 'react';
import { Outlet } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, getAuthPersist, setToken, setPersist, clearToken } from '../features/auth/authSlice';
import { useRefreshMutation } from '../features/auth/authApiSlice';

export default function PersistLogin() {
  console.log('rendering persistLogin');

  const dispatch = useDispatch();
  const accessToken = useSelector(getToken);
  const persist = useSelector(getAuthPersist); // start as false
  const [refresh] = useRefreshMutation();

  // local loading state
  const [isLoading, setIsLoading] = React.useState(true);
    const [persistLoaded, setPersistLoaded] = React.useState(false);


  React.useEffect(() => {
    console.log('running persistLogin getLocalStorage useEffect');
    
    localStorage.getItem('persist') === 'true'
      ? dispatch(setPersist(true))
      : dispatch(setPersist(false));
    
    setPersistLoaded(true);
  }, [dispatch]);

  React.useEffect(() => {
    let isMounted = true;

    console.log('running persistLogin verifyRefreshToken useEffect');
    
    const verifyRefreshToken = async () => { 
      console.log('running verifyRefreshToken');
      try {
        const response = await refresh().unwrap();
        console.log('response from verifyRefreshToken: ', response);
        isMounted && dispatch(setToken(response.accessToken));
      } catch (error) {
        console.error('in verifyRefreshToken error: ', error);
        isMounted && dispatch(clearToken());
      } finally {
        isMounted && setIsLoading(false);
      }
    }

    if (!persistLoaded) return;

    (!accessToken && persist) ? verifyRefreshToken() : setIsLoading(false);

    return () => { isMounted = false; }
  }, [accessToken, persist, persistLoaded, dispatch, refresh]);

  React.useEffect(() => {
    console.log('')
    console.count('in PersistLogin useEffect');
    console.log('in PersistLogin. isLoading: ', isLoading);
    console.log('in PersistLogin. accessToken: ', JSON.stringify(accessToken));
    console.log('in PersistLogin. persist: ', JSON.stringify(persist));
    console.log('')
  }, [isLoading, accessToken, persist]);

  return (
    isLoading
      ? <p>Loading...</p>
      : <Outlet />
  )
}
