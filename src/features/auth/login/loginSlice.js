import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: {
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

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email.value = action.payload;
      state.email.hasErrors = false;
      state.email.errorMessage = '';
    },
    setPassword: (state, action) => {
      state.password.value = action.payload;
      state.password.hasErrors = false;
      state.password.errorMessage = '';
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
    setLoginError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetEmail: (state) => {
      state.email.value = '';
      state.email.hasErrors = false;
      state.email.errorMessage = '';
    },
  },
});

export const selectEmail = (state) => state.login.email;
export const selectPassword = (state) => state.login.password;
export const getLoginStatus = (state) => state.login.status;
export const getLoginError = (state) => state.login.error;

export const { setEmail, setPassword, setEmailError, setLoginError, setStatus, resetEmail } = loginSlice.actions;

export default loginSlice.reducer;
