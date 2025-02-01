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
        // Dispatch setUser to store user data in Redux
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
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      dispatch(resetForm());
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h3 className="text-lg w-full font-medium mb-2">Create an account</h3>
        <div className="flex gap-4 mb-7">
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserSignup;
