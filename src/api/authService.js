import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// errors will be caught in App.js and displayed to the user

export const cancelToken = axios.CancelToken.source();

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  console.log('In authService registerUser: ', response);
  return response;
};

// Log in an existing user
export const logInUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('In authService logInUser: ', response);
  return response;
};

export const logOutUser = async () => {
  const response = await api.post('/auth/logout');
  console.log('In authService logOutUser: ', response);
  return response;
}
