import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
  bootstrapped: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.status = 'authenticated';
      state.error = null;
      state.bootstrapped = true;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.accessToken = action.payload;
    },
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    setBootstrapped(state, action) {
      state.bootstrapped = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
      state.bootstrapped = true;
    }
  }
});

export const { setCredentials, setUser, setToken, setAuthStatus, setAuthError, setBootstrapped, clearAuth } = authSlice.actions;
export default authSlice.reducer;
