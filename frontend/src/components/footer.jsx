import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">PetVet</h3>
          <p>
            Caring for your pets with love and professionalism. 
            We provide grooming, boarding, training, and veterinary care.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#about" className="hover:text-white">About Us</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
            <li><a href="#packages" className="hover:text-white">View Packages</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <p>Email: support@petvet.com</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Address: Colombo, Sri Lanka</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center border-t border-gray-600 mt-10 pt-6 text-sm text-gray-400">
        © {new Date().getFullYear()} PetVet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
