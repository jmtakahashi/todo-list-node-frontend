import { createSlice } from "@reduxjs/toolkit";
import {
  USERNAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from '../../../utils/regex';

const initialState = {
  email: {
    value: '',
    hasErrors: false,
    errorMessage: '',
    isUnique: false,
    isValidEmail: false,
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
    setUsername: (state, action) => {
      state.username.value = action.payload;

      if (action.payload === '') {
        state.username.hasErrors = false;
        state.username.errorMessage = '';
      } else {
        if (!USERNAME_REGEX.test(action.payload)) {
          state.username.hasErrors = true;
          state.username.errorMessage = 'Invalid username format';
        } else {
          state.username.hasErrors = false;
          state.username.errorMessage = '';
        }
      }
    },
    setPassword: (state, action) => {
      state.password.value = action.payload;

      if (action.payload === '') {
        state.password.hasErrors = false;
        state.password.errorMessage = '';
      } else {
        if (!PASSWORD_REGEX.test(action.payload)) {
          state.password.hasErrors = true;
          state.password.errorMessage = 'Invalid password format';
        } else {
          state.password.hasErrors = false;
          state.password.errorMessage = '';
        }
      }
    },
    setEmailIsUnique: (state) => {
      state.email.hasErrors = false;
      state.email.errorMessage = '';
      state.email.isUnique = true;
    },
    setEmailIsNotUnique: (state) => {
      state.email.hasErrors = true;
      state.email.errorMessage = 'Email is already in use';
      state.email.isUnique = false;
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
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setRegisterError: (state, action) => {
      state.error = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const selectEmail = (state) => state.register.email;
export const selectUsername = (state) => state.register.username;
export const selectPassword = (state) => state.register.password;
export const getRegisterStatus = (state) => state.register.status;
export const getRegisterError = (state) => state.register.error;

export const {
  setEmail,
  setUsername,
  setPassword,
  setEmailIsUnique,
  setEmailIsNotUnique,
  setEmailError,
  setStatus,
  setRegisterError,
  resetState,
} = registerSlice.actions;

export default registerSlice.reducer;
