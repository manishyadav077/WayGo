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
};

const captainAuthSlice = createSlice({
  name: "captainAuth",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { setFormField, resetForm } = captainAuthSlice.actions;
export default captainAuthSlice.reducer;
