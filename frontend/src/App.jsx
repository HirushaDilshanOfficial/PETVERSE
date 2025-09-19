import { Route, Routes, Outlet } from "react-router";

import ServicePage from "./pages/ServicePage";
import CreatePage from "./pages/CreateService";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import SelectServiceCategory from "./pages/SelectServiceCategory";
import ServicePdashboard from "./pages/ServicePdashboard";
import MyServices from "./pages/MyServices";
import EditService from "./pages/EditService";
import Navbar from "./Components/Navbar";


const RootLayout = () => (
  <div data-theme="emerald">
    <Navbar />
    <Outlet />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout /> }>
        <Route path="/" element={<ServicePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/create/select" element={<SelectServiceCategory />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/provider/dashboard" element={<ServicePdashboard />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/service/:id/edit" element={<EditService />} />
      </Route>
    </Routes>
  );
};

export default App;
