import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string;
  email: string;
  token: string;
}

interface UserState {
  // Store 'user' directly here
  user: User | null;
}

const storedUser = localStorage.getItem("user");
const initialState: UserState = {
  // Directly set 'user' from localStorage
  user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      // Directly assign 'user' to the state
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null; // Clear 'user' on logout
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
