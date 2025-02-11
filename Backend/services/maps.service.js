const axios = require("axios");
const captainModel = require("../models/captain.model");

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

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Query is required");
  }

  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    input
  )}&countrycodes=np&limit=5`;

  try {
    const response = await axios.get(url);

    if (response.data && response.data.length > 0) {
      return response.data.map((result) => {
        const mappedResult = {
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        };

        return mappedResult;
      });
    }
    return [];
  } catch (err) {
    console.error("Error fetching suggestions:", err.message);
    return [];
  }
};

// module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
//   try {
//     // 🔍 Debug: Print all captains before filtering
//     const allCaptains = await captainModel.find({});
//     console.log("Total captains in DB:", allCaptains.length);
//     console.log("All Captains:", allCaptains);

//     // 🌍 Find active captains near pickup location using `$near`
//     const captains = await captainModel.find({
//       status: "active", // Only active captains
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [lng, lat] },
//           $maxDistance: radius * 1000, // Convert km to meters
//         },
//       },
//     });

//     console.log(`🚖 Found ${captains.length} captains near pickup location.`);
//     return captains;
//   } catch (error) {
//     console.error("❌ Error finding captains in radius:", error);
//     return [];
//   }
// };

module.exports.getAllActiveCaptains = async () => {
  try {
    const captains = await captainModel.find({ status: "active" });
    console.log(`🚖 Found ${captains.length} active captains.`);
    return captains;
  } catch (error) {
    console.error("Error finding captains:", error);
    return [];
  }
};
