import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdFrontend = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [ads, setAds] = useState([]);

  const durationOptions = [
  { label: "15 Days - Rs 3000", value: 15 },
  { label: "1 Month (30 Days) - Rs 5000", value: 30 },
  { label: "2 Months (60 Days) - Rs 9000", value: 60 },
];


  // Fetch ads on load
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/advertisements");
        setAds(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ads");
      }
    };
    fetchAds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !duration) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("duration", duration);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile); // matches multer
      }

      const res = await axios.post("http://localhost:5001/api/advertisements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Advertisement created!");
      setAds((prev) => [res.data.ad, ...prev]);

      // reset form
      setTitle("");
      setDuration("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create ad");
    }
  };

  const onSelectImage = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-[#1E40AF]">Create Advertisement</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            
            {durationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Ad Image</label>
          <input type="file" accept="image/*" onChange={onSelectImage} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#1E40AF] text-white font-medium rounded-xl shadow hover:bg-[#F97316] transition"
        >
          Submit Advertisement
        </button>
      </form>

      {/* Ad Listing */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-[#1E40AF] mb-4">Your Advertisements</h3>
        {ads.length === 0 ? (
          <p className="text-gray-500">No advertisements yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="p-4 rounded-2xl border bg-white shadow hover:shadow-md transition"
              >
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-bold text-gray-800">{ad.title}</h4>
                <p className="text-gray-600">Rs {ad.price}</p>
                <p className="text-sm text-gray-500">Duration: {ad.duration} days</p>
                <p className="text-sm text-gray-500">{ad.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdFrontend;

