import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import RiderLogin from "./pages/RiderLogin";
import RiderSignup from "./pages/RiderSignup";
import Home from "./pages/Home";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import RiderProtectWrapper from "./pages/RiderProtectWrapper";
import RiderLogout from "./pages/RiderLogout";
import Riding from "./pages/Riding";
import RiderHome from "./pages/RiderHome";
import RiderRiding from "./pages/RiderRiding";
import Loader from "./component/loader";

import "remixicon/fonts/remixicon.css";

const App = () => {
  return (
    <div>
      <Loader/>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/rider-riding" element={<RiderRiding />} />

        <Route path="/signup" element={<UserSignup />} />
        <Route path="/rider-login" element={<RiderLogin />} />
        <Route path="/rider-signup" element={<RiderSignup />} />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/rider-home"
          element={
            <RiderProtectWrapper>
              <RiderHome />
            </RiderProtectWrapper>
          }
        />
        <Route
          path="/rider/logout"
          element={
            <RiderProtectWrapper>
              <RiderLogout />
            </RiderProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
