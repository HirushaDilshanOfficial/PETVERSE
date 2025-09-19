import React from "react";
import { Routes, Route } from "react-router-dom"; 
import ServiceDetailPage from "./Pages/ServiceDetailPage";
import ContactUsPage from "./Pages/Contactus";
import TestProvider from "./Pages/TestProvider";
import TestAdmin from "./Pages/TestAdmin";
import TestHome from "./Pages/TestHome";
import Contactus from "./Pages/Contactus";

const App = () => {
  return (
    <Routes>
      <Route path="/service/:id" element={<ServiceDetailPage />} />
       <Route path="/ServiceDetailPage" element={<ServiceDetailPage />} />
      <Route path="/contactus" element={<Contactus />} />
      <Route path="/TestAdmin" element={<TestAdmin />} />
      <Route path="/TestHome" element={<TestHome />} />
      <Route path="/TestProvider" element={<TestProvider />} />

      
    </Routes>
  );
};

export default App;
