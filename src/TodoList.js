import React from 'react'
import axios from 'axios';
import TodoComposer from './TodoComposer';
import Todo from './Todo';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

const fetchTodos = async () => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

export default function TodoList() {
  const [todos, setTodos] = React.useState([])

  React.useEffect(() => {
    const handleFetchTodos = async () => {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
    }
    handleFetchTodos()
  }, [])

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await api.post('/todos/addTodo', newTodo);
      if (response.status === 200) {
        newTodo._id = response.data; // assign the returned id to the new todo
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }
  
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      const response = await api.patch(`/todos/${updatedTodo._id}`, updatedTodo);
      if (response.status === 200) {
        const updatedTodos = todos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo,
        );
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      if (response.status === 200) {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (  
    <ul className='todo-list__todos'>
      <TodoComposer handleAddTodo={handleAddTodo} />
      {todos &&
        todos.map((todo) => (
          <Todo
            key={todo._id}
            todo={todo}
            handleUpdateTodo={handleUpdateTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        ))}
    </ul>
  );
}
