import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  vehicleColor: "",
  vehiclePlate: "",
  vehicleCapacity: "",
  vehicleType: "",
  _id: null, // Add captain ID
  token: null, // Add token for authentication
  isLoggedIn: false, // Add login status
};

const captainAuthSlice = createSlice({
  name: "captainAuth",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setCaptain: (state, action) => {
      const { email, firstName, lastName, _id, token } = action.payload;
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      state._id = _id;
      state.token = token;
      state.isLoggedIn = true;
    },
    resetForm: () => initialState,
    logout: () => initialState, // Clear all captain data on logout
  },
});

export const { setFormField, setCaptain, resetForm, logout } =
  captainAuthSlice.actions;
export default captainAuthSlice.reducer;
