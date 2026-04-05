import React from 'react';
import { Outlet } from 'react-router';
import { store } from '../../app/store';
import { listApiSlice } from '../list/listApiSlice';

const Prefetch = () => {
  React.useEffect(() => {
    store.dispatch(listApiSlice.util.prefetch('fetchLists', 'listsList', { force: true })); // force: true will ignore any cache and refetch data every time we mount this component
  }, []);

  return <Outlet />;
};
export default Prefetch;
