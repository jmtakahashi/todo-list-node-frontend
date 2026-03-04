import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// errors will be caught in App.js and displayed to the user

export const cancelToken = axios.CancelToken.source();

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  console.log('In authService: ', response);
  return response;
};

// Log in an existing user
export const logInUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('In authService: ', response);
  return response;
};
