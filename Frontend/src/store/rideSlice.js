import { createSlice } from "@reduxjs/toolkit";

const rideSlice = createSlice({
  name: "ride",
  initialState: {
    pickup: "",
    destination: "",
    fare: {},
    vehicleType: null,
    ride: null,
    vehiclePanel: false,
    confirmRidePanel: false,
    vehicleFound: false,
    waitingForDriver: false,
    pickupSuggestions: [],
    destinationSuggestions: [],
    activeField: null,
  },
  reducers: {
    setPickup: (state, action) => {
      state.pickup = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setFare: (state, action) => {
      state.fare = action.payload;
    },
    setVehicleType: (state, action) => {
      state.vehicleType = action.payload;
    },
    setRide: (state, action) => {
      state.ride = action.payload;
    },
    setVehiclePanel: (state, action) => {
      state.vehiclePanel = action.payload;
    },
    setConfirmRidePanel: (state, action) => {
      state.confirmRidePanel = action.payload;
    },
    setVehicleFound: (state, action) => {
      state.vehicleFound = action.payload;
    },
    setWaitingForDriver: (state, action) => {
      state.waitingForDriver = action.payload;
    },
    setPickupSuggestions: (state, action) => {
      state.pickupSuggestions = action.payload;
    },
    setDestinationSuggestions: (state, action) => {
      state.destinationSuggestions = action.payload;
    },
    setActiveField: (state, action) => {
      state.activeField = action.payload;
    },
  },
});

export const {
  setPickup,
  setDestination,
  setFare,
  setVehicleType,
  setRide,
  setVehiclePanel,
  setConfirmRidePanel,
  setVehicleFound,
  setWaitingForDriver,
  setPickupSuggestions,
  setDestinationSuggestions,
  setActiveField,
} = rideSlice.actions;

export default rideSlice.reducer;
