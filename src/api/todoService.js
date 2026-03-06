import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// errors will be caught in App.js and displayed to the user

// Fetch all todos
export const fetchTodos = async (token) => {
  const response = await api.get('/todos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Add a new todo
export const addTodo = async (todo, token) => {
  const response = await api.post('/todos/addTodo', todo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Update an existing todo
export const updateTodo = async (updatedTodo, token) => {
  const response = await api.patch(`/todos/${updatedTodo._id}`, updatedTodo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } );
  return response;
};

// Delete a todo
export const deleteTodo = async (id, token) => {
  const response = await api.delete(`/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
