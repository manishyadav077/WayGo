import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, resetForm } from "../store/userAuthSlice";
import axios from "axios";
import Input from "../component/Input";

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = useSelector((state) => state.userAuth);

  const handleInputChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      email: email,
      password: password,
    };

    const response = await axios.post("/api/users/login", newUser);

    if (response.status === 201) {
      const data = response.data;
      dispatch(setFormField({ value: data.user }));
      localStorage.setItem("token", data.token);
      navigate("/home");
    }
    dispatch(resetForm());
  };

  // Word-by-word animation for the title
  const titleText = "Revolutionize Your Ride";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < titleText.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle((prev) => prev + titleText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100); // Adjust speed of animation (100ms per character)
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Left Side: Title and Rider Registration Option */}
      <div className="flex-1 flex flex-col justify-center items-start p-12 text-white">
        <h1 className="text-6xl font-bold mb-6">
          {displayedTitle}
          <span className="animate-pulse">|</span> {/* Cursor effect */}
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

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105"
        >
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Welcome Back!
          </h3>
          <div className="flex flex-col gap-6">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="w-full"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              className="w-full"
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
              to="/signup"
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

export default UserLogin;
