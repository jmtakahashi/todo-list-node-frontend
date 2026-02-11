import React from 'react'
import axios from 'axios';
import TodoComposer from './TodoComposer';
import Todo from './Todo';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export default function TodoList() {
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false); // for error handling (not implemented yet)
  const [errorMessage, setErrorMessage] = React.useState(""); // for success handling (not implemented yet)

  React.useEffect(() => {
    const handleFetchTodos = async () => {
      setLoading(true);
      try {
        const response = await api.get('/todos');
        const fetchedTodos = response.data; // the response from the server will be an array of todos
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError(true);
        setErrorMessage('Error getting todos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    handleFetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    setError(false);
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await api.post('/todos/addTodo', newTodo);
      if (response.status === 200) {
        const newTodoWithId = response.data; // the new todo returned from the server will include its id 
        const updatedTodos = [...todos, newTodoWithId];
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error adding new todo:', error);
      setError(true);
      setErrorMessage('Error adding new todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateTodo = async (updatedTodo) => {
    setError(false);
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await api.patch(
        `/todos/${updatedTodo._id}`,
        updatedTodo,
      );
      if (response.status === 200) {
        const updatedTodos = todos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo,
        );
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error updating todo:', error);
      setError(true);
      setErrorMessage('Error updating todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    setError(false);
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await api.delete(`/todos/${id}`);
      if (response.status === 200) {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ul className='todo-list__todos'>
      <TodoComposer handleAddTodo={handleAddTodo} />
      {loading && <p>Loading...</p>}
      {error && <p>{errorMessage}</p>}

      {!loading && !error ? (
        <>
          {todos &&
            todos.map((todo) => (
              <Todo
                key={todo._id}
                todo={todo}
                handleUpdateTodo={handleUpdateTodo}
                handleDeleteTodo={handleDeleteTodo}
              />
            ))}
        </>
      ) : null}
    </ul>
  );
}
