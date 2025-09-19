import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [pendingAds, setPendingAds] = useState([]);

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/advertisements/pending");
      setPendingAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(`http://localhost:5001/api/advertisements/${id}/${action}`);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="space-y-4">
      {pendingAds.length === 0 ? (
        <p className="text-gray-600">No pending ads for review.</p>
      ) : (
        pendingAds.map((ad) => (
          <div
            key={ad._id}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
              <p className="text-gray-600">{ad.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(ad._id, "approve")}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(ad._id, "reject")}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
