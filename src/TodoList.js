import React from 'react'
import axios from 'axios';
import TodoComposer from './TodoComposer';
import Todo from './Todo';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const handleFetchTodos = async () => {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
      setLoading(false);
    }
    handleFetchTodos()
  }, [])

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await api.post('/todos/addTodo', newTodo);
      if (response.status === 200) {
        const newTodoWithId = response.data; // the new todo returned from the server will include its id 
        const updatedTodos = [...todos, newTodoWithId];
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error adding new todo:', error);
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
      {loading ? (
        <p>Loading...</p>
      ) : ( 
        <>
          {todos &&
            todos.map((todo) => (
              <Todo
                key={todo._id}
                todo={todo}
                handleUpdateTodo={handleUpdateTodo}
                handleDeleteTodo={handleDeleteTodo}
              />
            ))
          }
        </>
      )}
    </ul>
  );
}
