import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Packages from "./pages/packages";
import GrPackages from "./pages/grpackages";
import TrPackages from "./pages/trpackages";
import VetPackages from "./pages/vetpackages";
import NewPuppy from "./pages/NewPuppy";
import NewKitten from "./pages/NewKitten";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boarding" element={<Packages />} />
      <Route path="/grooming" element={<GrPackages />} />
      <Route path="/training" element={<TrPackages />} />
      <Route path="/veterinary" element={<VetPackages />} />
      <Route path="/new-puppy" element={<NewPuppy />} />
      <Route path="/new-kitten" element={<NewKitten />} />
    </Routes>
  );
}

export default App;
