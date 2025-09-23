// src/pages/Packages.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";

const Packages = () => {
  const [activePackage, setActivePackage] = useState(""); // Basic, Premium, Luxury
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    pet_name: "",
    pet_type: "",
    other_pet_type: "",
    pet_breed: "",
    other_pet_breed: "",
    note: "",
  });
  const [submittedData, setSubmittedData] = useState(null);

  const petBreeds = {
    Dog: ["Labrador", "German Shepherd", "Bulldog", "Beagle", "Poodle", "Other"],
    Cat: ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal", "Other"],
    Rabbit: ["Holland Lop", "Netherland Dwarf", "Lionhead", "Flemish Giant", "Other"],
    Bird: ["Parakeet", "Cockatiel", "Lovebird", "Canary", "Other"],
    Hamster: ["Syrian", "Dwarf Winter White", "Roborovski", "Other"],
  };

  const packages = [
    { name: "Basic", description: "Standard care for your pet while you're away." },
    { name: "Premium", description: "Extra attention, playtime, and grooming included." },
    { name: "Luxury", description: "VIP treatment with full grooming, training, and care." },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit appointment to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePackage) return;

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      alert("Please select a date and time in the future.");
      return;
    }

    const appointmentData = {
      ...formData,
      package: activePackage,
      appointment_id: `APT-${Date.now()}`, // unique id for backend
      user_id: "USER-123", // replace with actual user id if available
      status: "Scheduled",
    };

    try {
      const res = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!res.ok) {
        throw new Error("Failed to book appointment, check server connection");
      }

      const data = await res.json();
      setSubmittedData(data);

      // Reset form
      setFormData({
        date: "",
        time: "",
        pet_name: "",
        pet_type: "",
        other_pet_type: "",
        pet_breed: "",
        other_pet_breed: "",
        note: "",
      });
      setActivePackage("");
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  // ✅ Generate PDF
  const downloadPDF = () => {
    if (!submittedData) return;
    const doc = new jsPDF();

    const img = new Image();
    img.src = "/PVL4.png"; // logo in public folder
    img.onload = () => {
      doc.addImage(img, "PNG", 15, 10, 25, 25);

      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175);
      doc.text("PETVERSE", 45, 25);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Appointment Details", 20, 50);

      doc.setFontSize(12);
      doc.text(`Package: ${submittedData.package}`, 20, 65);
      doc.text(`Date: ${submittedData.date}`, 20, 75);
      doc.text(`Time: ${submittedData.time}`, 20, 85);
      doc.text(`Pet Name: ${submittedData.pet_name}`, 20, 95);
      doc.text(
        `Pet Type: ${
          submittedData.pet_type === "Other"
            ? submittedData.other_pet_type
            : submittedData.pet_type
        }`,
        20,
        105
      );
      doc.text(
        `Pet Breed: ${
          submittedData.pet_breed === "Other"
            ? submittedData.other_pet_breed
            : submittedData.pet_breed
        }`,
        20,
        115
      );
      doc.text(`Notes: ${submittedData.note}`, 20, 125);

      doc.save("boarding-appointment-details.pdf");
    };
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#1E40AF] text-center">
        Boarding & Daycare Packages
      </h1>

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`p-6 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              activePackage === pkg.name ? "border-4 border-[#F97316]" : "border-2 border-gray-200"
            } bg-white`}
            onClick={() => setActivePackage(pkg.name)}
          >
            <h2 className="text-2xl font-bold mb-3 text-[#1E40AF]">{pkg.name}</h2>
            <p className="text-gray-700">{pkg.description}</p>
            <button
              className="mt-4 w-full bg-[#F97316] hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-full transition-all"
              onClick={() => setActivePackage(pkg.name)}
            >
              Select
            </button>
          </div>
        ))}
      </div>

      {/* Form Section */}
      {activePackage && !submittedData && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-[#f3f4f6] p-8 rounded-2xl shadow-lg mb-8"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#1E40AF]">
            {activePackage} Package Booking Form
          </h2>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          {/* Pet Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Pet Name</label>
            <input
              type="text"
              name="pet_name"
              value={formData.pet_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          {/* Pet Type & Breed */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pet Type</label>
              <select
                name="pet_type"
                value={formData.pet_type}
                onChange={(e) =>
                  setFormData({ ...formData, pet_type: e.target.value, pet_breed: "" })
                }
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="">Select Pet Type</option>
                {Object.keys(petBreeds).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {formData.pet_type === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Pet Type"
                  value={formData.other_pet_type}
                  onChange={handleChange}
                  name="other_pet_type"
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  required
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Pet Breed</label>
              {formData.pet_type && formData.pet_type !== "Other" ? (
                <select
                  name="pet_breed"
                  value={formData.pet_breed}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                >
                  <option value="">Select Breed</option>
                  {petBreeds[formData.pet_type].map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Breed"
                  name="pet_breed"
                  value={formData.pet_breed}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  required
                />
              )}
              {formData.pet_breed === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Breed"
                  name="other_pet_breed"
                  value={formData.other_pet_breed}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  required
                />
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E40AF] hover:bg-[#153A8D] text-white py-3 font-semibold rounded-xl transition-all"
          >
            Enter Details
          </button>
        </form>
      )}

      {/* Confirmation + PDF */}
      {submittedData && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-3">Appointment Scheduled Successfully!</h2>
          <p className="mb-4 text-gray-700">
            Your {submittedData.package} package appointment has been booked. You can download the
            details below.
          </p>
          <button
            onClick={downloadPDF}
            className="bg-[#F97316] hover:bg-orange-500 text-white py-2 px-6 rounded-full font-semibold transition-all"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Packages;
