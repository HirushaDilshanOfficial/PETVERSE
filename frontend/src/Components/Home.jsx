// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaw, FaUserCircle, FaChevronDown, FaBars, FaTimes, FaStar, FaShieldAlt, FaClock, FaHeart } from "react-icons/fa";
import MiniCart from "../components/MiniCart";
import { useAuth, isPetOwner } from "../contexts/AuthContext";

const PawLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <FaPaw className="text-[#F97316] w-16 h-16 animate-bounce" />
          <div className="absolute inset-0 bg-[#F97316] opacity-30 rounded-full animate-ping"></div>
        </div>
        <p className="text-white mt-4 font-medium">Loading PetVerse...</p>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, signout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path) => {
    setLoading(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 700);
  };

  const handleProfileClick = () => {
    if (!user) {
      handleNavigate("/login");
      return;
    }

    if (isPetOwner(user)) {
      handleNavigate("/dashboard/pet-owner/profile");
    } else {
      handleNavigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await signout();
      handleNavigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const services = [
    {
      title: "Boarding & Daycare",
      description: "Safe and comfortable care for your pets while you're away with 24/7 monitoring.",
      image: "/PCB1.png",
      path: "/boarding",
      color: "bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]",
      icon: "🏠"
    },
    {
      title: "Professional Grooming",
      description: "Expert grooming services to keep your pets looking and feeling their absolute best.",
      image: "/pg1.jpg",
      path: "/grooming",
      color: "bg-gradient-to-br from-[#F97316] to-[#FB923C]",
      icon: "✂️"
    },
    {
      title: "Pet Training",
      description: "Effective training sessions for better behavior, obedience, and stronger bonds.",
      image: "/pt1.jpg",
      path: "/training",
      color: "bg-gradient-to-br from-[#10B981] to-[#34D399]",
      icon: "🎯"
    },
    {
      title: "Veterinary Care",
      description: "Experienced veterinarians providing comprehensive health care and medical services.",
      image: "/pv1.jpeg",
      path: "/veterinary",
      color: "bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]",
      icon: "🩺"
    }
  ];

  const petStories = [
    {
      name: "Buddy's Journey",
      story: "Thanks to PetVerse's veterinary care, Buddy recovered quickly from an illness. Their platform made booking super easy!",
      owner: "Sarah M.",
      image: "/PO.jpg",
      rating: 5
    },
    {
      name: "Luna's Grooming",
      story: "Luna looked absolutely gorgeous after her grooming session. Booking through PetVerse was a breeze!",
      owner: "Daniel R.",
      image: "/PC3.jpg",
      rating: 5
    },
    {
      name: "Coco's Checkup",
      story: "Coco, my parrot, got the best veterinary care. PetVerse's loyalty program even gave me reward points!",
      owner: "Ayesha K.",
      image: "/PP2.jpg",
      rating: 5
    }
  ];

  const achievements = [
    { number: "350+", label: "Happy Clients", icon: <FaHeart className="text-red-500" /> },
    { number: "5+", label: "Years Experience", icon: <FaShieldAlt className="text-blue-500" /> },
    { number: "235+", label: "Happy Pets", icon: <FaPaw className="text-orange-500" /> },
    { number: "24/7", label: "Support Available", icon: <FaClock className="text-green-500" /> }
  ];

  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-[#1C2A4A] to-[#1E293B] min-h-screen font-sans text-gray-100 relative overflow-x-hidden">
      {loading && <PawLoader />}

      {/* Enhanced Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-[#1E40AF]/95 backdrop-blur-md shadow-2xl py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src="/PVL4.png" alt="PetVerse Logo" className="h-12 w-12 rounded-full shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] rounded-full animate-pulse"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PETVERSE
              </span>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex space-x-8 font-medium">
              {[
                { name: "Home", href: "#home" },
                { name: "Services", action: () => handleNavigate("/services") },
                { name: "Products", href: "#products" },
                { name: "About", href: "#about" }
              ].map((link) => (
                <li key={link.name}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="px-4 py-2 rounded-full hover:bg-[#F97316] hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="px-4 py-2 rounded-full hover:bg-[#F97316] hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNavigate("/contactus")}
                  className="px-4 py-2 rounded-full hover:bg-[#F97316] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </button>
              </li>
            </ul>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <MiniCart />
              
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {user && isPetOwner(user) ? (
                  <div className="relative group">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white text-[#1E40AF] font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaUserCircle className="text-xl" />
                      <span>Profile</span>
                      <FaChevronDown className="text-sm group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-1">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1E40AF] transition-colors duration-200"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigate("/login")}
                      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white hover:text-[#1E40AF] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => handleNavigate("/signup")}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-semibold hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#1E40AF]/95 backdrop-blur-md transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="px-4 py-6 space-y-4">
            {["Home", "Services", "Products", "About", "Contact Us"].map((link) => (
              <button
                key={link}
                onClick={() => link === "Services" ? handleNavigate("/services") : 
                         link === "Contact Us" ? handleNavigate("/contactus") : null}
                className="block w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                {link}
              </button>
            ))}
            
            {user && isPetOwner(user) ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left py-3 px-4 rounded-lg bg-white text-[#1E40AF] font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="block w-full py-3 px-4 rounded-lg bg-white/10 text-center font-semibold"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigate("/signup")}
                  className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#F97316] to-[#FB923C] text-center font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/PETVERSE.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] bg-clip-text text-transparent">
                Welcome to PetVerse
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              "Until one has loved an animal, a part of one's soul remains unawakened."
            </p>
            <p className="text-base md:text-lg text-gray-400 italic">– Anatole France</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={() => handleNavigate("/services")}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-semibold hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105"
              >
                Explore Services
              </button>
              <button
                onClick={() => handleNavigate("/products")}
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-2xl transform hover:scale-105"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <FaChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
                Our Premium Services
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive care solutions designed with your pet's happiness and health in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                onClick={() => handleNavigate(service.path)}
                className={`${service.color} rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 text-3xl bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center space-x-2">
                    <FaPaw className="w-5 h-5 animate-bounce" />
                    <span>{service.title}</span>
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Shop Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#16203D] to-[#1E293B]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
                🛒 Shop With Us
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Discover premium pet products carefully curated for your furry family members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-white mb-2">Free Delivery</h3>
              <p className="text-gray-400 text-sm">Orders above Rs. 5,000</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">Carefully selected products</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-gray-400 text-sm">Pet care guidance included</p>
            </div>
          </div>
          
          <button
            onClick={() => handleNavigate("/products")}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-semibold hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* Enhanced Pet Stories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
                🐾 Happy Tails: Pet Stories
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from happy pet parents who trust PetVerse with their furry family members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petStories.map((story, index) => (
              <div
                key={story.name}
                className="bg-gradient-to-br from-[#1C2A4A] to-[#2D3748] p-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-white/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{story.name}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">{story.story}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#F97316] font-medium">– {story.owner}</span>
                  <FaHeart className="text-red-500 w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced New Pet Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#16203D] to-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* New Puppy */}
            <div
              onClick={() => handleNavigate("/new-puppy")}
              className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 cursor-pointer group"
            >
              <img 
                src="/ND.jpeg" 
                alt="New Puppy" 
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
                  New Puppy? 🐶
                </h3>
                <p className="text-white text-lg md:text-xl font-semibold mb-4">
                  Get everything they need right here
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  Explore Puppy Essentials
                </div>
              </div>
            </div>

            {/* New Kitten */}
            <div
              onClick={() => handleNavigate("/new-kitten")}
              className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 cursor-pointer group"
            >
              <img 
                src="/NC3.jpg" 
                alt="New Kitten" 
                className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
                  New Kitten? 🐱
                </h3>
                <p className="text-white text-lg md:text-xl font-semibold mb-4">
                  Get everything they need right here
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white font-medium">
                  Explore Kitten Essentials
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Achievements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
                🌟 Why Choose PetVerse?
              </span>
            </h2>
            <p className="text-lg text-gray-300">
              Trusted by pet parents across Sri Lanka for exceptional care and service
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.label}
                className="bg-gradient-to-br from-[#1E293B] to-[#2D3748] p-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-center border border-white/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3">
                  {achievement.icon}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {achievement.number}
                </h3>
                <p className="text-gray-300 text-sm">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/PVL4.png" alt="PetVerse Logo" className="h-12 w-12 rounded-full" />
                <span className="font-bold text-2xl text-white">PetVerse</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Caring for your pets with love and professionalism. We provide comprehensive
                grooming, boarding, training, and veterinary care services with modern facilities
                and experienced professionals.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <div className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center hover:bg-[#EA580C] transition-colors duration-300 cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:bg-[#1A91DA] transition-colors duration-300 cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-[#E4405F] rounded-full flex items-center justify-center hover:bg-[#D12E4A] transition-colors duration-300 cursor-pointer">
                  <span className="text-white font-bold">i</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Services", href: "#services" },
                  { name: "About Us", href: "#about" },
                  { name: "Contact", action: () => handleNavigate("/contactus") },
                  { name: "Products", action: () => handleNavigate("/products") }
                ].map((link) => (
                  <li key={link.name}>
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="hover:text-[#F97316] transition-colors duration-300 text-left w-full"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-[#F97316] transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Services</h3>
              <ul className="space-y-3">
                {[
                  { name: "Pet Boarding", action: () => handleNavigate("/boarding") },
                  { name: "Grooming", action: () => handleNavigate("/grooming") },
                  { name: "Training", action: () => handleNavigate("/training") },
                  { name: "Veterinary", action: () => handleNavigate("/veterinary") }
                ].map((service) => (
                  <li key={service.name}>
                    <button
                      onClick={service.action}
                      className="hover:text-[#F97316] transition-colors duration-300 text-left w-full"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">@</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-sm text-gray-400">support@petverse.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-sm text-gray-400">+94 77 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-sm text-gray-400">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-r from-[#1E40AF]/20 to-[#F97316]/20 rounded-2xl p-8 mb-12 border border-white/10">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated with PetVerse
              </h3>
              <p className="text-gray-300 mb-6">
                Get the latest pet care tips, service updates, and exclusive offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors duration-300"
                />
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white font-semibold hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-600 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400">
                  ©️ {new Date().getFullYear()} PetVerse. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Made with ❤️ for pet lovers everywhere
                </p>
              </div>
              
              <div className="flex space-x-6 text-xs text-gray-400">
                <button className="hover:text-[#F97316] transition-colors duration-300">
                  Privacy Policy
                </button>
                <button className="hover:text-[#F97316] transition-colors duration-300">
                  Terms of Service
                </button>
                <button className="hover:text-[#F97316] transition-colors duration-300">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleNavigate("/contactus")}
          className="w-14 h-14 bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full shadow-2xl hover:shadow-orange-500/25 flex items-center justify-center text-white transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          💬
        </button>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1E293B;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #F97316;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #EA580C;
        }
        
        /* Mobile responsive improvements */
        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2.5rem;
          }
          
          .text-3xl {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;