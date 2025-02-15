import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, resetForm, setCaptain } from "../store/captainAuthSlice";

import axios from "axios";
import Input from "../component/Input";

const RiderLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password } = useSelector((state) => state.captainAuth);

  const handleInputChange = (field, value) => {
    const updatedValue = field === "vehicleCapacity" ? Number(value) : value;
    dispatch(setFormField({ field, value: updatedValue }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      email,
      password,
    };

    const response = await axios.post("/api/captain/login", captainData);
    if (response.status === 200) {
      const data = response.data;
      console.log("captain data", data);
      dispatch(
        setCaptain({
          email: data.captain.email,
          firstName: data.captain.fullname.firstname,
          lastName: data.captain.fullname.lastname,
          _id: data.captain._id,
          token: data.token,
        })
      );
      localStorage.setItem("token", data.token);
      // dispatch(resetForm());
      navigate("/rider-home");
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
    <div className="flex min-h-screen bg-[rgb(16,23,42)]">
      <div className="flex-1 flex flex-col justify-center items-start p-12 text-white">
        <h1 className="text-6xl font-bold mb-6">
          {displayedTitle}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-xl mb-8">
          Join the future of ride-sharing. Fast, reliable, and eco-friendly.
        </p>
        <Link
          to="/rider-signup"
          className="bg-white text-blue-600 py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
        >
          Register as a Rider
        </Link>
      </div>
      <div className="border-r-2 border-white h-ato mr-1.5 my-5"></div>
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105"
        >
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Welcome Back Rider!!
          </h3>
          <div className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg mt-8 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer"
          >
            Login
          </button>
          <div className="flex justify-center gap-1.5 mt-6 text-sm">
            <h2 className="text-gray-600">Don't have an account?</h2>
            <Link
              to="/rider-signup"
              className="text-blue-500 hover:text-blue-700 font-semibold transition-all duration-300"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderLogin;
