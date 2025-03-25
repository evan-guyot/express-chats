import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  tokenExpiration: Date;
}

interface UserState {
  user: User | null;
}

const storedUser = localStorage.getItem("user");
const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const isTokenExpired = (user: User): boolean => {  
  return user !== null && new Date(user.tokenExpiration) < new Date();
};

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
