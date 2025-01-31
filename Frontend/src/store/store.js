import { configureStore } from "@reduxjs/toolkit";
import captainAuthReducer from "./captainAuthSlice";
import userAuthReducer from "./userAuthSlice";

const store = configureStore({
  reducer: {
    captainAuth: captainAuthReducer,
    userAuth: userAuthReducer,
  },
});
export default store;
