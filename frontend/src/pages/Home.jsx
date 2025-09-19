// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import MiniCart from "../components/MiniCart";

const PawLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <FaPaw className="text-[#F97316] w-16 h-16 animate-bounce" />
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="bg-[#1C2A4A] min-h-screen font-sans text-gray-100 relative">
      {loading && <PawLoader />}

      {/* Navbar */}
      <nav className="bg-[#1E40AF] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/PVL4.png" alt="PetVerse Logo" className="h-12 w-12 mr-3" />
          <span className="font-bold text-xl">PETVERSE</span>
        </div>
        <ul className="flex space-x-6 font-semibold">
          {["Home", "Services", "Products", "About"].map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="px-4 py-2 rounded-full hover:bg-[#F97316] transition-all duration-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <MiniCart />
          <button
            onClick={() => handleNavigate("/login")}
            className="px-4 py-2 rounded-full bg-white text-[#1E40AF] font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Log In
          </button>
          <button
            onClick={() => handleNavigate("/signup")}
            className="px-4 py-2 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Video Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/PETVERSE.mp4"
          autoPlay
          loop
          muted
        />
      </section>

      {/* Welcome Section */}
      <section className="text-center py-8 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F97316]">
          Welcome to PetVerse
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-gray-200 italic">
          “Until one has loved an animal, a part of one’s soul remains unawakened.” <br />
          <br />
          – Anatole France - 
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-[#1C2A4A]">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#F97316]">
          Our Services
        </h2>
        <div className="grid gap-10 md:grid-cols-4 max-w-6xl mx-auto">
          {/* Boarding & Daycare */}
          <div
            onClick={() => handleNavigate("/boarding")}
            className="relative bg-[#1E40AF] text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col cursor-pointer"
          >
            <img src="/PCB1.png" alt="Boarding & Daycare" className="w-full h-48 object-cover" />
            <div className="p-6 text-center flex-1">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
                <FaPaw className="text-[#F97316] w-5 h-5 animate-bounce" />
                Boarding & Daycare
              </h3>
              <p>Safe and comfortable care for your pets while you're away.</p>
            </div>
          </div>

          {/* Grooming */}
          <div
            onClick={() => handleNavigate("/grooming")}
            className="relative bg-[#F97316] text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col cursor-pointer"
          >
            <img src="/pg1.jpg" alt="Grooming" className="w-full h-48 object-cover" />
            <div className="p-6 text-center flex-1">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
                <FaPaw className="text-[#1E40AF] w-5 h-5 animate-bounce" />
                Grooming
              </h3>
              <p>Professional grooming services to keep your pets looking their best.</p>
            </div>
          </div>

          {/* Training */}
          <div
            onClick={() => handleNavigate("/training")}
            className="relative bg-[#1E40AF] text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col cursor-pointer"
          >
            <img src="/pt1.jpg" alt="Training" className="w-full h-48 object-cover" />
            <div className="p-6 text-center flex-1">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
                <FaPaw className="text-[#F97316] w-5 h-5 animate-bounce" />
                Training
              </h3>
              <p>Effective training sessions for better behavior and obedience.</p>
            </div>
          </div>

          {/* Veterinary */}
          <div
            onClick={() => handleNavigate("/veterinary")}
            className="relative bg-[#F97316] text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col cursor-pointer"
          >
            <img src="/pv1.jpeg" alt="Veterinary" className="w-full h-48 object-cover" />
            <div className="p-6 text-center flex-1">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
                <FaPaw className="text-[#1E40AF] w-5 h-5 animate-bounce" />
                Veterinary
              </h3>
              <p>Experienced vets providing routine checkups and medical care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🛒 Shop With Us Section */}
      <section className="py-20 px-6 bg-[#16203D] text-center">
        <h2 className="text-4xl font-bold text-[#F97316] mb-6">
          Shop With Us for Your Pet
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Explore our wide range of pet products and give your furry friend the best care!
        </p>
        <button
          onClick={() => handleNavigate("/products")}
          className="px-8 py-3 rounded-full bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-all duration-300"
        >
          Shop Now
        </button>
      </section>

      {/* 🐾 Pet Stories Section */}
      <section className="py-20 px-6 bg-[#1E293B] text-center">
        <h2 className="text-4xl font-bold text-[#F97316] mb-10">
          Happy Tails: Pet Stories
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          See how PetVerse has helped pet parents and their furry friends.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Story 1 */}
          <div className="bg-[#1C2A4A] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <img
              src="/PO.jpg"
              alt="Buddy the Dog"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white">Buddy's Journey</h3>
            <p className="text-gray-300 mt-2">
              "Thanks to PetVerse's veterinary care, Buddy recovered quickly from an illness.
              Their platform made booking super easy!"
            </p>
            <span className="block mt-3 text-sm text-gray-400">– Sarah M.</span>
          </div>

          {/* Story 2 */}
          <div className="bg-[#1C2A4A] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <img
              src="/PC3.jpg"
              alt="Luna the Cat"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white">Luna's Grooming</h3>
            <p className="text-gray-300 mt-2">
              "Luna looked absolutely gorgeous after her grooming session.
              Booking through PetVerse was a breeze!"
            </p>
            <span className="block mt-3 text-sm text-gray-400">– Daniel R.</span>
          </div>

          {/* Story 3 */}
          <div className="bg-[#1C2A4A] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <img
              src="/PP2.jpg"
              alt="Coco the Parrot"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white">Coco's Checkup</h3>
            <p className="text-gray-300 mt-2">
              "Coco, my parrot, got the best veterinary care.
              PetVerse's loyalty program even gave me reward points for booking!"
            </p>
            <span className="block mt-3 text-sm text-gray-400">– Ayesha K.</span>
          </div>
        </div>
      </section>

      {/* 🐶 New Puppy / Kitten Section */}
      <section className="py-20 px-6 bg-[#16203D]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* New Puppy */}
          <div
            onClick={() => handleNavigate("/new-puppy")}
            className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <img src="/ND.jpeg" alt="New Puppy" className="w-full h-64 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <h3
                className="text-white text-4xl md:text-5xl text-center font-bold"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                New Puppy?
              </h3>
              <p className="text-white text-xl md:text-2xl text-center font-bold mt-2 px-4">
                Get everything they need right here
              </p>
            </div>
          </div>

          {/* New Kitten */}
          <div
            onClick={() => handleNavigate("/new-kitten")}
            className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <img src="/NC3.jpg" alt="New Kitten" className="w-full h-64 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <h3
                className="text-white text-4xl md:text-5xl text-center font-bold"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                New Kitten?
              </h3>
              <p className="text-white text-xl md:text-2xl text-center font-bold mt-2 px-4">
                Get everything they need right here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Achievements Section (Smaller & Moved Below Puppy/Kitten) */}
      <section className="py-16 px-6 bg-[#0f172a] text-center">
        <h2 className="text-3xl font-bold text-[#F97316] mb-10">
          Why Choose PetVerse?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Happy Clients */}
          <div className="bg-[#1E293B] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-4xl font-extrabold text-white mb-2">350+</h3>
            <p className="text-gray-300 text-base">Happy Clients</p>
          </div>

          {/* Experience */}
          <div className="bg-[#1E293B] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-4xl font-extrabold text-white mb-2">5+</h3>
            <p className="text-gray-300 text-base">Years Experience</p>
          </div>

          {/* Happy Pets */}
          <div className="bg-[#1E293B] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-4xl font-extrabold text-white mb-2">235+</h3>
            <p className="text-gray-300 text-base">Happy Pets</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-gray-300 py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">PetVerse</h3>
            <p>
              Caring for your pets with love and professionalism. We provide grooming,
              boarding, training, and veterinary care.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#packages" className="hover:text-white">View Packages</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p>Email: support@petverse.com</p>
            <p>Phone: +94 77 123 4567</p>
            <p>Address: Colombo, Sri Lanka</p>
          </div>
        </div>

        <div className="text-center border-t border-gray-600 mt-10 pt-6 text-sm text-gray-400">
          ©️ {new Date().getFullYear()} PetVerse All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;