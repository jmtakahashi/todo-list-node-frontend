import React from 'react'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api/todoService';
import TodoComposer from './TodoComposer';
import Todo from './Todo';

export default function TodoList() {
  // todo: { _id, task, completed, loading }
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // for loading state while fetching all todos from the server
  const [error, setError] = React.useState(''); // for error handling (not implemented yet)

  React.useEffect(() => {
    const handleFetchTodos = async () => {
      setLoading(true);
      try {
        const response = await fetchTodos();
        const fetchedTodos = response; // the response from the server will be an array of todos
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError('Error getting todos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    handleFetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    setError('');
    try {
      const response = await addTodo(newTodo);
      if (response.status === 200) {
        const newTodoWithId = response.data; // the new todo returned from the server will include its id 
        const updatedTodos = [...todos, newTodoWithId];
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error adding new todo:', error);
      setError('Error adding new todo. Please try again.');
    } finally {
    }
  };
  
  const handleUpdateTodo = async (updatedTodo) => {
    setError('');
    try {
      const response = await updateTodo(updatedTodo,);
      if (response.status === 200) {
        const updatedTodos = todos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo,
        );
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Error updating todo. Please try again.');
    } finally {
    }
  };

  const handleDeleteTodo = async (id) => {
    setError('');
    try {
      const response = await deleteTodo(id);
      if (response.status === 200) {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      }
      // if the response status is not 200, we can set an error state (not implemented yet)
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Error deleting todo. Please try again.');
    } finally {
    }
  };

  return (
    <ul className='todo-list__todos'>
      <TodoComposer handleAddTodo={handleAddTodo} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        todos.map((todo) => (
          <Todo
            key={todo._id}
            todo={todo}
            handleUpdateTodo={handleUpdateTodo}
            handleDeleteTodo={handleDeleteTodo}
            loading={todo.loading}
          />
        ))}
    </ul>
  );
}
