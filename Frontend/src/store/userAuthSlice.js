import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  _id: null, // Add user ID
  token: null, // Add token for authentication
  isLoggedIn: false, // Add login status
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setUser: (state, action) => {
      console.log("Payload Received in Reducer:", action.payload);
      const { email, firstName, lastName, _id, token } = action.payload;
      console.log("Payload Received in Reducer:", action.payload);
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      state._id = _id;
      state.token = token;
      state.isLoggedIn = true;
    },
    resetForm: () => initialState,
    logout: () => initialState, // Clear all user data on logout
  },
});

export const { setFormField, setUser, resetForm, logout } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
