import React from "react";
import { useNavigate } from "react-router-dom";

const NewPuppy = () => {
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
          Steps to Getting Your First Dog
        </h1>
        <p className="text-lg md:text-xl text-gray-700 italic">
          Everything you need to prepare for your new furry family member
        </p>
        <img
          src="/NP.jpg"
          alt="Happy Puppy"
          className="w-full h-64 md:h-96 object-cover rounded-xl mt-6 shadow-lg"
        />
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-6 space-y-12">

        {/* Section 1: Preparing Your Home */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">1. Preparing Your Home</h2>
          <p className="mb-4">
            Before bringing your new puppy home, ensure your living space is safe and comfortable.
            Remove any hazardous items and create a dedicated area for their bed, toys, and feeding.
          </p>
          <img
            src="/PP.jpg"
            alt="Puppy Play Area"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <div className="bg-[#E0F7FA] p-4 rounded-lg border-l-4 border-[#00ACC1] mb-2">
            <strong>Tip:</strong> Puppies need a quiet space to rest. Avoid placing their bed in high-traffic areas.
          </div>
        </section>

        {/* Section 2: Choosing the Right Supplies */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">2. Choosing the Right Supplies</h2>
          <p className="mb-4">
            Make sure you have the essentials: food and water bowls, leash, collar, toys, and puppy-friendly bedding.
          </p>
          <img
            src="/PS.jpg"
            alt="Puppy Supplies"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Comfortable bedding</li>
            <li>High-quality puppy food</li>
            <li>Chew toys to prevent boredom</li>
            <li>Leash and collar for training and walks</li>
          </ul>
          <div className="bg-[#FFF3E0] p-4 rounded-lg border-l-4 border-[#FB8C00] mt-4">
            <strong>Note:</strong> Avoid toys with small parts that can be swallowed.
          </div>
        </section>

        {/* Section 3: First Vet Visit */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">3. First Vet Visit</h2>
          <p className="mb-4">
            Schedule your puppy’s first checkup with a veterinarian. This ensures vaccinations, deworming, and overall health are on track.
          </p>
          <img
            src="/PV10.jpg"
            alt="Puppy Vet Visit"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <div className="bg-[#E8F5E9] p-4 rounded-lg border-l-4 border-[#43A047]">
            <strong>Highlight:</strong> Keep a record of all vaccinations and vet visits for future reference.
          </div>
        </section>

        {/* Section 4: Training & Socialization */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">4. Training & Socialization</h2>
          <p className="mb-4">
            Start basic training early, including housebreaking and simple commands. Socialize your puppy with other dogs and people.
          </p>
          <img
            src="/PP1.jpg"
            alt="Puppy Training"
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-4"
          />
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Housebreaking tips</li>
            <li>Leash training</li>
            <li>Positive reinforcement</li>
            <li>Early socialization</li>
          </ol>
        </section>

        {/* Section 5: Creating a Bond */}
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-[#F97316]">5. Creating a Strong Bond</h2>
          <p>
            Spend quality time with your puppy. Play, cuddle, and communicate regularly to build trust and affection.
          </p>
          <img
            src="/PC.jpg"
            alt="Bond with Puppy"
            className="w-full h-64 md:h-96 object-cover rounded-xl mt-4"
          />
        </section>

      </main>
    </div>
  );
};

export default NewPuppy;
