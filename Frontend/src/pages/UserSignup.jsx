import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, setUser, resetForm } from "../store/userAuthSlice";
import axios from "axios";
import Input from "../component/Input";

const UserSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password, firstName, lastName } = useSelector(
    (state) => state.userAuth
  );

  const handleInputChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("/api/users/register", newUser);

      if (response.status === 201) {
        const data = response.data;
        console.log("data for user", data);
        dispatch(
          setUser({
            email: data.user.email,
            firstName: data.user.fullname.firstname,
            lastName: data.user.fullname.lastname,
            _id: data.user._id,
            token: data.token,
          })
        );
        localStorage.setItem("token", data.token); // Optional: Store token in localStorage
        navigate("/home");
        // dispatch(resetForm());
      }
    } catch (error) {
      console.error("Signup failed:", error);
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
          <h3 className="text-2xl font-bold text-center mb-4 text-blue-950">
            Create an account
          </h3>
          <div className="flex flex-col gap-3 mb-5">
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
              placeholder="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
            <Input
              label="Password"
              placeholder="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              labelClassName="text-[15px]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg mt-1 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer"
          >
            Sign Up
          </button>
          <div className="flex justify-center gap-1.5 mt-6 text-sm">
            <h2 className="text-gray-600">Already have an account?</h2>
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-700 font-semibold transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
