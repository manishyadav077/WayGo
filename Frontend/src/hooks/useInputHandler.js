import { useDispatch } from "react-redux";
import { fetchSuggestions } from "../services/rideService";
import {
  setPickup,
  setDestination,
  setPickupSuggestions,
  setDestinationSuggestions,
} from "../store/rideSlice";
import { useCallback } from "react";
import { debounce } from "lodash";
import { startLoading, stopLoading } from "../store/loadingSlice";

export const useInputHandlers = () => {
  const dispatch = useDispatch();

  const debouncedFetchPickupSuggestions = useCallback(
    debounce(async (value, token, lat, lng) => {
      dispatch(startLoading());
      try {
        const suggestions = await fetchSuggestions(value, token, lat, lng);
        dispatch(setPickupSuggestions(suggestions));
      } catch (error) {
        console.error("Error fetching pickup suggestions:", error);
      } finally {
        dispatch(stopLoading());
      }
    }, 700),
    []
  );

  const debouncedFetchDestinationSuggestions = useCallback(
    debounce(async (value, token, lat, lng) => {
      dispatch(startLoading());
      try {
        const suggestions = await fetchSuggestions(value, token, lat, lng);
        dispatch(setDestinationSuggestions(suggestions));
      } catch (error) {
        console.error("Error fetching destination suggestions:", error);
      } finally{
        dispatch(stopLoading());
      }
    }, 700),
    []
  );

  const handlePickupChange = (e) => {
    const value = e.target.value;
    dispatch(setPickup(value));

    const storedLocation = localStorage.getItem("userLocation");
    let userLocation = storedLocation ? JSON.parse(storedLocation) : null;

    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      console.warn("User location not available - using default coordinates");
      userLocation = { lat: 0, lng: 0 };
    }

    debouncedFetchPickupSuggestions(
      value,
      localStorage.getItem("token"),
      userLocation.lat,
      userLocation.lng
    );
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    dispatch(setDestination(value));

    const storedLocation = localStorage.getItem("userLocation");
    let userLocation = storedLocation ? JSON.parse(storedLocation) : null;

    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      console.warn("User location not available - using default coordinates");
      userLocation = { lat: 0, lng: 0 };
    }

    debouncedFetchDestinationSuggestions(
      value,
      localStorage.getItem("token"),
      userLocation.lat,
      userLocation.lng
    );
  };

  return { handlePickupChange, handleDestinationChange };
};
