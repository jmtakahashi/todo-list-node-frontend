import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: {
    value: '',
    hasErrors: false,
    message: '',
    isUnique: false,
  },
  username: {
    value: '',
    hasErrors: false,
    message: '',
  },
  password: {
    value: '',
    hasErrors: false,
    message: '',
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEmail: (state, action) => { 
      state.email.value = action.payload;
      state.email.hasErrors = false;
      state.email.message = '';
    },
    setUsername: (state, action) => {
      state.username.value = action.payload;
      state.username.hasErrors = false;
      state.username.message = '';
    },
    setPassword: (state, action) => {
      state.password.value = action.payload;
      state.password.hasErrors = false;
      state.password.message = '';
    },
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    setStatus: (state, action) => {
      state.status = action.payload.status;
    }
  }
});

export const selectEmail = (state) => state.register.email;
export const selectUsername = (state) => state.register.username;
export const selectPassword = (state) => state.register.password;
export const getRegisterStatus = (state) => state.register.status;
export const getRegisterError = (state) => state.register.error;

export const { setEmail, setUsername, setPassword, setError, setStatus } = registerSlice.actions;

export default registerSlice.reducer;
