import { getItem } from '@green-world/utils/cookie';
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | undefined | undefined;
  isAuthenticated: boolean;
  userId: string | undefined;
  userRole: string | undefined;
}

const initialState: AuthState = {
  token: undefined,
  isAuthenticated: false,
  userId: undefined,
  userRole: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      const token = getItem('token');
      let userId = undefined;
      let userRole = undefined;
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          userId = decodedToken._id || undefined;
          userRole = decodedToken.role || undefined;
        } catch (error) {
          console.error('Invalid token');
        }
      }
      state.token = token;
      state.isAuthenticated = !!userId;
      state.userId = userId;
      state.userRole = userRole;
    },
    setUnauthenticated: (state) => {
      state.token = undefined;
      state.isAuthenticated = false;
      state.userId = undefined;
      state.userRole = undefined;
    }
  }
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
