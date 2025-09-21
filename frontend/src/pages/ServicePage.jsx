import  { useEffect, useState } from 'react'
import { Link } from 'react-router';
import RateLimitedUI from '../Components/RateLimitedUI.jsx';
import api from "../lib/axios.js"
import ServiceCard from '../Components/ServiceCard.jsx';
import toast from "react-hot-toast"

const ServicePage = () => {
  const [isRateLimited, setIsRateLimited]=useState(false);
  const [services, setServices]=useState([])
  const [loading, setLoading] =useState(true)

  useEffect(()=>{
    const fetchServices=async()=>{
      try{
        console.log('Fetching services...');
        const res=await api.get(`/api/services`);
        console.log('Services response:', res.data);
        console.log('Services array length:', res.data.length);
        // Debug: Check if any services have images
        res.data.forEach((service, index) => {
          console.log(`Service ${index}:`, {
            title: service.title,
            hasImages: service.images && service.images.length > 0,
            imageCount: service.images ? service.images.length : 0,
            firstImage: service.images && service.images.length > 0 ? service.images[0] : null
          });
        });
        setServices(res.data);
        setIsRateLimited(false);
      }catch(error){
        console.log("Error fetching services", error);
        console.log(error.response);
        if(error.response?.status===429){
          setIsRateLimited(true)
        }else{
          toast.error("failed to load services")
        }
      }finally{
        setLoading(false)
      }
    };
    fetchServices();
  },[]
  );

 return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="flex justify-end mb-4">
        </div>

        {loading && <div className="text-center text-[#1E40AF] py-10 font-semibold">Loading services...</div>}

        {!loading && services.length === 0 && !isRateLimited && (
          <div className="text-center text-gray-500 py-10 font-semibold">No services found</div>
        )}

        {services.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} setServices={setServices}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ServicePage
