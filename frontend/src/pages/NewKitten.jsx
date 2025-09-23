import React from "react";
import { useNavigate } from "react-router-dom";

const NewKitten = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans text-gray-800">

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#1E40AF] text-white px-4 py-2 rounded-full hover:bg-[#153A8D] transition-all mb-6"
        >
          ← Back to Home
        </button>
      </div>

      {/* Blog Header */}
      <header className="max-w-4xl mx-auto px-6 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E40AF]">
          Steps to Getting Your First Kitten
        </h1>
        <p className="text-lg md:text-xl text-gray-700 italic">
          Everything you need to prepare for your new furry little friend
        </p>
        <img
          src="/NK.jpg"
          alt="Happy Kitten"
          className="w-full h-64 md:h-96 object-cover rounded-xl mt-6 shadow-lg"
        />
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-6 space-y-12">

        {/* Section 1: Preparing Your Home */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">1. Preparing Your Home</h2>
          <p className="mb-4">
            Before bringing your new kitten home, ensure your space is safe, warm, and quiet.
            Remove dangerous objects and designate areas for feeding, sleeping, and play.
          </p>
          <img
            src="/KP.jpg"
            alt="Kitten Play Area"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <div className="bg-[#E0F7FA] p-4 rounded-lg border-l-4 border-[#00ACC1] mb-2">
            <strong>Tip:</strong> Keep toxic plants and small objects out of reach of curious kittens.
          </div>
        </section>

        {/* Section 2: Choosing the Right Supplies */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">2. Choosing the Right Supplies</h2>
          <p className="mb-4">
            Essentials include litter box, food and water dishes, scratching posts, toys, and cozy bedding.
          </p>
          <img
            src="/KS.jpg"
            alt="Kitten Supplies"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Litter box with scoop</li>
            <li>High-quality kitten food</li>
            <li>Safe toys for play</li>
            <li>Scratching post to protect furniture</li>
          </ul>
          <div className="bg-[#FFF3E0] p-4 rounded-lg border-l-4 border-[#FB8C00] mt-4">
            <strong>Note:</strong> Avoid small toys that could be swallowed.
          </div>
        </section>

        {/* Section 3: First Vet Visit */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">3. First Vet Visit</h2>
          <p className="mb-4">
            Schedule your kitten’s first checkup to ensure vaccinations, deworming, and overall health.
          </p>
          <img
            src="/KV.png"
            alt="Kitten Vet Visit"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <div className="bg-[#E8F5E9] p-4 rounded-lg border-l-4 border-[#43A047]">
            <strong>Highlight:</strong> Maintain a health record for vaccinations and vet visits.
          </div>
        </section>

        {/* Section 4: Socialization & Training */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">4. Socialization & Training</h2>
          <p className="mb-4">
            Introduce your kitten to new experiences gradually. Train litter habits and gentle play behaviors.
          </p>
          <img
            src="/KT.jpg"
            alt="Kitten Training"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Encourage litter box use</li>
            <li>Gentle handling and play</li>
            <li>Introduce new environments gradually</li>
            <li>Provide positive reinforcement</li>
          </ol>
        </section>

        {/* Section 5: Building a Bond */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">5. Building a Strong Bond</h2>
          <p>
            Spend quality time cuddling and playing with your kitten. Regular interaction builds trust and affection.
          </p>
          <img
            src="/KB.jpg"
            alt="Bond with Kitten"
            className="w-full h-64 md:h-96 object-cover rounded-xl mt-4"
          />
        </section>

      </main>
    </div>
  );
};

export default NewKitten;
