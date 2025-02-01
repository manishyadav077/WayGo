import { configureStore } from "@reduxjs/toolkit";
import captainAuthReducer from "./captainAuthSlice";
import userAuthReducer from "./userAuthSlice";
import socketReducer from "./socketSlice"
import rideReducer from "./rideSlice"

const store = configureStore({
  reducer: {
    captainAuth: captainAuthReducer,
    userAuth: userAuthReducer,
    socket: socketReducer,
    ride: rideReducer
  },
});
export default store;
