const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user, pickup, destination, vehicleType } = req.body;

  try {
    // ✅ Create ride first
    const ride = await rideService.createRide({
      user,
      pickup,
      destination,
      vehicleType,
    });

    // ✅ Send response immediately
    res.status(201).json(ride);

    // ✅ Fetch pickup coordinates
    let pickupCoordinates;
    try {
      pickupCoordinates = await mapService.getAddressCoordinate(pickup);
      if (!pickupCoordinates) {
        console.warn("⚠️ No coordinates found for pickup location:", pickup);
        return;
      }
    } catch (error) {
      console.error("❌ Error getting pickup coordinates:", error);
      return;
    }

    // ✅ Find nearby captains
    let captainsInRadius;
    try {
      captainsInRadius = await mapService.getCaptainsInTheRadius(
        pickupCoordinates.ltd,
        pickupCoordinates.lng,
        2
      );
      if (!captainsInRadius.length) {
        console.warn("⚠️ No captains found in radius.");
        return;
      }
    } catch (error) {
      console.error("❌ Error getting captains:", error);
      return;
    }

    // ✅ Remove OTP for privacy
    ride.otp = "";

    // ✅ Populate ride user details
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    // ✅ Send WebSocket messages
    captainsInRadius.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });
  } catch (err) {
    console.error("❌ Error creating ride:", err);
    return res.status(500).json({ message: "Failed to create ride" });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    // console.log(ride);

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  s;
};
