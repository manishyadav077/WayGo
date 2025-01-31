import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Initialize socket

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null, connected: false },
  reducers: {
    setSocket: (state) => {
      state.socket = socket;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { setSocket, setConnected } = socketSlice.actions;

export default socketSlice.reducer;
