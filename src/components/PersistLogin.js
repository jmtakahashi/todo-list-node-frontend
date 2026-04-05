import React from 'react';
import { Outlet } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { selectToken, selectAuthPersist, setToken, /*setPersist, */clearToken, setUserId } from '../features/auth/authSlice';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import { setLoginError } from '../features/auth/login/loginSlice';

export default function PersistLogin() {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectToken);
  const persist = useSelector(selectAuthPersist); // start as false
  const [refresh] = useRefreshMutation();
  
  // local loading state
  const [isLoading, setIsLoading] = React.useState(true);
  // const [persistLoaded, setPersistLoaded] = React.useState(false);


  // React.useEffect(() => {
  //   localStorage.getItem('persist') === 'true'
  //     ? dispatch(setPersist(true))
  //     : dispatch(setPersist(false));
    
  //   setPersistLoaded(true);
  // }, [dispatch]);

  React.useEffect(() => {
    let isMounted = true;
    
    const verifyRefreshToken = async () => {       
      try {
        const response = await refresh().unwrap();

        const decoded = jwtDecode(response.accessToken);
        isMounted && dispatch(setToken(response.accessToken));
        isMounted && dispatch(setUserId(decoded.id));
      } catch (error) {
        isMounted &&
        console.error(
          error.data?.message || 'Session expired. Please log in again.',
        );
        isMounted && dispatch(clearToken());
        isMounted &&
          dispatch(
            setLoginError(
              error.data?.message || 'Session expired. Please log in again.',
            ),
          );
      } finally {
        isMounted && setIsLoading(false);
      }
    }

    // if (!persistLoaded) return;

    (!accessToken && persist) ? verifyRefreshToken() : setIsLoading(false);

    return () => { isMounted = false; }
  }, [accessToken, persist, /* persistLoaded,*/ dispatch, refresh]);

  return (
    isLoading
      ? <p>Loading...</p>
      : <Outlet />
  )
}
