const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require('./routes/captain.routes')
const mapRoutes = require('./routes/map.route')
const rideRoutes = require('./routes/ride.routes')

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);
app.use('/api/captain', captainRoutes)
app.use("/api/maps", mapRoutes)
app.use('/api/rides', rideRoutes)

module.exports = app;
