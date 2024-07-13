import { getItem } from '@green-world/utils/cookie';
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null | undefined;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  userId: null,
  userRole: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      const token = getItem('token');
      let userId = null;
      let userRole = null;
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log(decodedToken);
          userId = decodedToken._id || null;
          userRole = decodedToken.role || null;
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
      state.token = null;
      state.isAuthenticated = false;
      state.userId = null;
      state.userRole = null;
    }
  }
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
