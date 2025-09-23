// src/pages/GrPackages.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";

const GrPackages = () => {
  const [activePackage, setActivePackage] = useState("");
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

  // ✅ Submit to backend
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
      appointment_id: `APT-${Date.now()}`, // Unique ID
      user_id: "USER-123", // Replace with actual user
      status: "Scheduled",
    };

    try {
      const res = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!res.ok) throw new Error("Failed to book appointment. Check server connection.");

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

    doc.setFontSize(16);
    doc.text("Grooming Appointment Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Package: ${submittedData.package}`, 20, 30);
    doc.text(`Date: ${submittedData.date}`, 20, 40);
    doc.text(`Time: ${submittedData.time}`, 20, 50);
    doc.text(`Pet Name: ${submittedData.pet_name}`, 20, 60);
    doc.text(
      `Pet Type: ${
        submittedData.pet_type === "Other"
          ? submittedData.other_pet_type
          : submittedData.pet_type
      }`,
      20,
      70
    );
    doc.text(
      `Pet Breed: ${
        submittedData.pet_breed === "Other"
          ? submittedData.other_pet_breed
          : submittedData.pet_breed
      }`,
      20,
      80
    );
    doc.text(`Notes: ${submittedData.note}`, 20, 90);
    doc.save("grooming-appointment-details.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#1E40AF] text-center">
        Grooming Packages
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
          {/* Form Fields same as before */}
          {/* Date, Time, Pet Name, Pet Type, Pet Breed, Notes */}
          {/* ...Copy all input/select fields from previous code... */}
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

export default GrPackages;
