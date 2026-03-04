import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// errors will be caught in App.js and displayed to the user

export const cancelToken = axios.CancelToken.source();

// Get a user by their email address
export const getUserByEmail = async (email, cancelToken) => {
  const response = await api.post(
    `/users/checkExistingUser`,
    { email: email },
    { cancelToken: cancelToken.token },
  );
  return response;
};