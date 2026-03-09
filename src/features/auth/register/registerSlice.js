import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: {
    value: '',
    hasErrors: false,
    errorMessage: '',
    isUnique: false,
  },
  username: {
    value: '',
    hasErrors: false,
    errorMessage: '',
  },
  password: {
    value: '',
    hasErrors: false,
    errorMessage: '',
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
    },
    setEmailIsUnique: (state, action) => {
      state.email.hasErrors = !action.payload.isUnique;
      state.email.errorMessage =  action.payload.message;
      state.email.isUnique = action.payload.isUnique;
    },
    setUsername: (state, action) => {
      state.username.value = action.payload;
    },
    setPassword: (state, action) => {
      state.password.value = action.payload;
    },
    setEmailError: (state, action) => {
      if (action.payload === '') {
        state.email.hasErrors = false;
        state.email.errorMessage = '';
      } else {
        state.email.hasErrors = true;
        state.email.errorMessage = action.payload;
      }
    },
    setUsernameError: (state, action) => {
      if (action.payload === '') {
        state.username.hasErrors = false;
        state.username.errorMessage = '';
      } else {
        state.username.hasErrors = true;
        state.username.errorMessage = action.payload;
      }
    },
    setPasswordError: (state, action) => {
      if (action.payload === '') {
        state.password.hasErrors = false;
        state.password.errorMessage = '';
      } else {
        state.password.hasErrors = true;
        state.password.errorMessage = action.payload;
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setRegisterError: (state, action) => {
      state.error = action.payload;
    },
    resetEmail: (state) => {
      state.email.value = '';
      state.email.hasErrors = false;
      state.email.errorMessage = '';
      state.email.isUnique = false;
    },
    resetUsername: (state) => {
      state.username.value = '';
      state.username.hasErrors = false;
      state.username.errorMessage = '';
    },
    resetPassword: (state) => {
      state.password.value = '';
      state.password.hasErrors = false;
      state.password.errorMessage = '';
    }
  }
});

export const selectEmail = (state) => state.register.email;
export const selectUsername = (state) => state.register.username;
export const selectPassword = (state) => state.register.password;
export const getRegisterStatus = (state) => state.register.status;
export const getRegisterError = (state) => state.register.error;

export const { setEmail, setEmailIsUnique, setUsername, setPassword, setEmailError, setUsernameError, setPasswordError, setRegisterError, setStatus, resetEmail, resetUsername, resetPassword } = registerSlice.actions;

export default registerSlice.reducer;
