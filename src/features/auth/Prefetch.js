import React from 'react';
import { store } from '../../app/store';
import { todosApiSlice } from '../todos/todosSlice';

const Prefetch = ({ children }) => {
  React.useEffect(() => {
    console.log('in Prefetch. subscribing...');
    const todos = store.dispatch(todosApiSlice.endpoints.fetchTodos.initiate());
    // todos is a promise that resolves to the query result object 
    // (which has a lot of useful properties like data, isLoading, isSuccess, isError, etc.) 
    // and also has an unsubscribe method that we can call to stop listening for 
    // updates to this query result (ie. stop refetching data when it changes or when we refocus the window).
    return () => {
      console.log('in Prefetch. unsubscribing...');
      todos.unsubscribe();
    };
  }, []);

  return children;
};
export default Prefetch;
