import React from "react";
import * as todoService from '../api/todoService';

export default function useTodo() {
  // todo: { _id, task, completed, loading, editLoading }
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // we need to memoize the functions we return from this hook so that 
  // they don't get recreated on every render of the components that use this hook,
  // which would cause unnecessary re-renders of those components.
  // in our TodoList, this would cause an infinite loop of re-rendering because we have a 
  // useEffect that depends on the fetchTodos function, so if fetchTodos gets recreated on every render, 
  // the useEffect will run on every render, which will cause fetchTodos to be called on every render, 
  // which will cause the state to update on every render, which will cause 
  // the component to re-render on every render, and so on.

  const fetchTodos = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await todoService.fetchTodos();
      if (response.status === 200) {
        const fetchedTodos = response.data; // the response from the server will be an array of todos
        setTodos(fetchedTodos);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Error getting todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = React.useCallback(async (newTodo) => { 
    try {
      setError('');

      // this is where we create a new todo with a loading: true and add it to 
      // the state immediately so that the user sees the new todo right away,
      // instead of waiting for the response from the server. then when we get
      // the response from the server, we can update the state with the new todo
      // that has the generated _id and loading: false.

      setTodos((prevTodos) => [...prevTodos, { ...newTodo, id: Math.random().toString(36).substr(2, 9), loading: true }]);

      const response = await todoService.addTodo(newTodo);
      if (response.status === 200) {
        const newTodoWithId = response.data; // the response from the server will be the new todo that was added w/ the generated _id
        setTodos(prevTodos => prevTodos.map(todo =>
          todo.loading === true ? newTodoWithId : todo
        ));
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = React.useCallback(async (updatedTodo) => {
    try {
      setError('');

      // this is where we add editloading: true to the updated todo immediately
      // so that the user sees the loading state right away.
      // then when we get the response from the server, we can update the state with the updated todo
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? { ...todo, editLoading: true } : todo,
        ),
      );

      const response = await todoService.updateTodo(updatedTodo);
      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo,
          ),
        );
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Error updating todo. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = React.useCallback(async (id) => {
    try {
      setError('');

      // this is where we edit the deleted todo with a loading: true immediately
      // so that the user sees the loading right away, instead of waiting for the 
      // response from the server. then when we get the response from the server, 
      // we can update the state and remove the deleted todo.
      setTodos((prevTodos) => prevTodos.map(todo => todo._id === id ? { ...todo, loading: true } : todo));

      const response = await todoService.deleteTodo(id);
      if (response.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Error deleting todo. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}