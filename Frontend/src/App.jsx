import React from "react";
import { Route, Routes } from "react-router-dom";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/captain-register" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/user-register" element={<UserSignup/>}/>
        <Route path="/user-login" element={<UserLogin/>}/>
      </Routes>
    </div>
  );
};

export default App;
