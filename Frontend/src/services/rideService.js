import axios from "axios";

export const fetchSuggestions = async (input, token, latitude, longitude) => {
  try {
    const response = await axios.get("/api/maps/get-suggestions", {
      params: { input, latitude, longitude },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching suggestions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchFare = async (pickup, destination, token) => {
  try {
    const response = await axios.get("/api/rides/get-fare", {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response for fare", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching fare:", error);
    throw error;
  }
};

export const createRide = async (
  pickup,
  destination,
  vehicleType,
  token,
  userId
) => {
  try {
    await axios.post(
      "/api/rides/create",
      { pickup, destination, vehicleType, user: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error creating ride:", error);
    throw error;
  }
};
