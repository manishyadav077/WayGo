import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Initialize socket

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null, connected: false },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { setSocket, setConnected } = socketSlice.actions;

export default socketSlice.reducer;
