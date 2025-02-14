import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, setCaptain, resetForm } from "../store/captainAuthSlice";
import axios from "axios";
import Input from "../component/Input";

const RiderSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    email,
    password,
    firstName,
    lastName,
    vehicleColor,
    vehiclePlate,
    vehicleCapacity,
    vehicleType,
  } = useSelector((state) => state.captainAuth);

  const handleInputChange = (field, value) => {
    const updatedValue = field === "vehicleCapacity" ? Number(value) : value;
    dispatch(setFormField({ field, value: updatedValue }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType,
      },
    };

    try {
      const response = await axios.post("/api/captain/register", captainData);

      if (response.status === 201) {
        const data = response.data;

        const { _id, email, fullname, token } = data.captain;

        dispatch(
          setCaptain({
            email: email,
            firstName: fullname.firstname,
            lastName: fullname.lastname,
            _id: _id,
            token: token,
          })
        );

        localStorage.setItem("token", token);

        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      dispatch(resetForm());
    }
  };

  const titleText = "Revolutionize Your Ride";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < titleText.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle((prev) => prev + titleText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex bg-[rgb(16,23,42)] p-6">
      <div className="flex-1 flex flex-col justify-center items-start p-12 text-white">
        <h1 className="text-6xl font-bold mb-6">
          {displayedTitle}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-xl mb-8">
          Join the future of ride-sharing. Fast, reliable, and eco-friendly.
        </p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
        >
          Register as a User
        </Link>
      </div>
      <div className="border-r-2 border-white h-auto mr-1.5"></div>

      <div className="p-6 bg-white rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-950">
          Rider Signup
        </h2>

        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Input
              label="Vehicle Color"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) =>
                handleInputChange("vehicleColor", e.target.value)
              }
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Vehicle Plate"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) =>
                handleInputChange("vehiclePlate", e.target.value)
              }
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Vehicle Capacity"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) =>
                handleInputChange("vehicleCapacity", e.target.value)
              }
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Vehicle Type"
              type="select"
              value={vehicleType}
              onChange={(e) => handleInputChange("vehicleType", e.target.value)}
              labelClassName="text-[15px]"
              required
              options={[
                { value: "car", label: "Car" },
                { value: "auto", label: "Auto" },
                { value: "motorcycle", label: "Moto" },
              ]}
            />
          </div>

          <div className="flex justify-center">
            <button className="mt-6  bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg px-6 py-2 text-lghover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer">
              Create Rider Account
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/rider-login" className="text-blue-500 font-medium">
            Login here
          </Link>
        </p>

        <p className="text-xs text-center mt-4">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default RiderSignup;
