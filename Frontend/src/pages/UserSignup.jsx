import React from "react";
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

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105"
        >
          <h3 className="text-lg w-full font-medium mb-2">Create an account</h3>
          <div className="flex flex-col gap-4 mb-7">
            <Input
              label="First Name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
            <Input
              label="Email"
              placeholder="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            <Input
              label="Password"
              placeholder="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>
          <button type="submit" className="cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
