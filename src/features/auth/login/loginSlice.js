import { createSlice } from "@reduxjs/toolkit";
import {
  EMAIL_REGEX,
} from '../../../utils/regex';

const initialState = {
  email: {
    value: '',
    hasErrors: false,
    errorMessage: '',
  },
  password: {
    value: '',
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

      if (action.payload === '') {
        state.email.hasErrors = false;
        state.email.errorMessage = '';
      } else {
        if (!EMAIL_REGEX.test(action.payload)) {
          state.email.hasErrors = true;
          state.email.errorMessage = 'Invalid email format';
        } else {
          state.email.hasErrors = false;
          state.email.errorMessage = '';
        }
      }      
    },
    setPassword: (state, action) => {
      state.password.value = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setLoginError: (state, action) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      state = initialState;
    },

  },
});

export const selectEmail = (state) => state.login.email;
export const selectPassword = (state) => state.login.password;
export const getLoginStatus = (state) => state.login.status;
export const getLoginError = (state) => state.login.error;

export const { setEmail, setPassword, setLoginError, setStatus, resetState } = loginSlice.actions;

export default loginSlice.reducer;
