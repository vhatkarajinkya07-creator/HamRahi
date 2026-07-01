
//sirf aapna aapna path dalna dusro ka mat change mat kr dena aur ... sidha AI se copy paste mat krna orginal code ko change mat krna
//                                                                                                  -AJINKYA VHATKAR


import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Destination from "../pages/Destination/Destination";
import About from "../pages/About/About";
import Login from "../pages/Login/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destination/:id" element={<Destination />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
