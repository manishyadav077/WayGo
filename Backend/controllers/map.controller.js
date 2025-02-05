const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinate(address);

    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Coordinates not found" });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    const distanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    console.log("Received Request:", req.query);

    const { input, latitude, longitude } = req.query;

    if (!input) {
      return res.status(400).json({ message: "Input query is required" });
    }

    if (!latitude || !longitude) {
      console.warn("⚠️ Missing latitude or longitude - Defaulting to 0,0");
    }

    const suggestions = await mapService.getAutoCompleteSuggestions(
      input,
      latitude || 0,
      longitude || 0
    );

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("❌ Error in getAutoCompleteSuggestions:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
