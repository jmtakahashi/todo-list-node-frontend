import React from 'react';
import { Outlet } from 'react-router';
import { store } from '../../app/store';
import { todoApiSlice } from '../todo/todoApiSlice';

const Prefetch = () => {
  React.useEffect(() => {
    store.dispatch(todoApiSlice.util.prefetch('fetchTodos', { force: true })); // force: true will ignore any cache and refetch data every time we mount this component
  }, []);

  return <Outlet />;
};
export default Prefetch;
