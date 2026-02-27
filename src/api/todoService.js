import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Fetch all todos
export const fetchTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

// Add a new todo
export const addTodo = async (todo) => {
  const response = await api.post('/todos/addTodo', todo);
  return response.data;
};

// Update an existing todo
export const updateTodo = async (id, updatedTodo) => {
  const response = await api.patch(`/todos/${id}`, updatedTodo);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
