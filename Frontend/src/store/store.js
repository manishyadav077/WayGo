import {configureStore} from "@reduxjs/toolkit"
import captainAuthReducer from "./captainAuthSlice"
const store = configureStore({
    reducer: {
        captainAuth: captainAuthReducer,
    }
})
export default store