import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Boarding & Daycare",
      description: "Safe and comfortable care for your pets while you're away.",
      image: "/PCB1.png",
      path: "/boarding",
      color: "bg-[#1E40AF]",
      accentColor: "text-[#F97316]",
    },
    {
      id: 2,
      title: "Grooming",
      description: "Professional grooming services to keep your pets looking their best.",
      image: "/pg1.jpg",
      path: "/grooming",
      color: "bg-[#F97316]",
      accentColor: "text-[#1E40AF]",
    },
    {
      id: 3,
      title: "Training",
      description: "Effective training sessions for better behavior and obedience.",
      image: "/pt1.jpg",
      path: "/training",
      color: "bg-[#1E40AF]",
      accentColor: "text-[#F97316]",
    },
    {
      id: 4,
      title: "Veterinary",
      description: "Experienced vets providing routine checkups and medical care.",
      image: "/pv1.jpeg",
      path: "/veterinary",
      color: "bg-[#F97316]",
      accentColor: "text-[#1E40AF]",
    },
  ];

  const handleServiceClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#1C2A4A] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F97316] mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive range of pet care services designed to keep your furry friends healthy, happy, and well-groomed.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.path)}
              className={`${service.color} text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col cursor-pointer`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
                  <FaPaw className={`${service.accentColor} w-5 h-5 animate-bounce`} />
                  <span>{service.title}</span>
                </h3>
                <p className="mb-4 flex-grow">{service.description}</p>
                <button
                  className={`mt-auto mx-auto px-4 py-2 rounded-full ${service.accentColor} bg-white font-semibold hover:bg-gray-100 transition-all duration-300`}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-[#16203D] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-[#F97316] mb-6">
            Why Choose Our Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="bg-[#1E293B] p-6 rounded-xl">
              <div className="text-5xl text-[#F97316] mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Care</h3>
              <p className="text-gray-300">
                Our certified professionals provide the highest quality care for your pets.
              </p>
            </div>
            <div className="bg-[#1E293B] p-6 rounded-xl">
              <div className="text-5xl text-[#F97316] mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Passionate Team</h3>
              <p className="text-gray-300">
                We love pets as much as you do and treat them like family.
              </p>
            </div>
            <div className="bg-[#1E293B] p-6 rounded-xl">
              <div className="text-5xl text-[#F97316] mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Safe Environment</h3>
              <p className="text-gray-300">
                Your pets are in a secure, clean, and comfortable environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;