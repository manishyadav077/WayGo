import { configureStore } from "@reduxjs/toolkit";
import captainAuthReducer from "./captainAuthSlice";
import userAuthReducer from "./userAuthSlice";
import socketReducer from "./socketSlice"
const store = configureStore({
  reducer: {
    captainAuth: captainAuthReducer,
    userAuth: userAuthReducer,
    socket: socketReducer,
  },
});
export default store;
