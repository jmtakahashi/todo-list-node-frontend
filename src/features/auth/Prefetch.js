import React from 'react';
import { store } from '../../app/store';
import { todoApiSlice } from '../todo/todoApiSlice';

const Prefetch = ({ children }) => {
  React.useEffect(() => {
    store.dispatch(todoApiSlice.util.prefetch('fetchTodos', { force: true })); // force: true will ignore any cache and refetch data every time we mount this component
    // todos is a promise that resolves to the query result object 
    // (which has a lot of useful properties like data, isLoading, isSuccess, isError, etc.) 
    // and also has an unsubscribe method that we can call to stop listening for 
    // updates to this query result (ie. stop refetching data when it changes or when we refocus the window).

  }, []);

  return children;
};
export default Prefetch;
