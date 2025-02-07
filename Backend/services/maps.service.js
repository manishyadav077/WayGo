const axios = require("axios");

module.exports.getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${encodeURIComponent(
    origin.lng
  )},${encodeURIComponent(origin.lat)};${encodeURIComponent(
    destination.lng
  )},${encodeURIComponent(destination.lat)}?overview=false`;

  try {
    const response = await axios.get(url);
    if (response.data.code === "Ok") {
      const { distance, duration } = response.data.routes[0];
      return { distance, duration };
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (
  input,
  latitude,
  longitude
) => {
  if (!input) {
    throw new Error("Query is required");
  }

  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    input
  )}&countrycodes=np&limit=5`;

  // if (latitude && longitude) {
  //   const viewbox = `${longitude - 0.1},${latitude + 0.1},${longitude + 0.1},${
  //     latitude - 0.1
  //   }`;
  //   url += `&viewbox=${viewbox}&bounded=1`;
  // }

  try {
    // console.log("Calling Nominatim API:", url);
    const response = await axios.get(url);
    // console.log("API Response:", response.data);

    if (response.data && response.data.length > 0) {
      // console.log("Response data:", response.data); 

      return response.data.map((result) => {
        // console.log("Current result:", result); 

        const mappedResult = {
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        };

        console.log("Mapped result:", mappedResult); // Log the mapped result

        return mappedResult;
      });
    }
    return [];
  } catch (err) {
    console.error("Error fetching suggestions:", err.message);
    return [];
  }
};
