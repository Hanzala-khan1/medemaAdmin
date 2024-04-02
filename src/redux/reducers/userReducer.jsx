import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: null,
  isLoggedIn: false,
  role: "",
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = localStorage.getItem("token");

    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setUser, setToken, setIsLoggedIn, setRole } =
  userReducer.actions;

export default userReducer.reducer;
