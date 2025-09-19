import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchApprovedAds = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/advertisements/approved");
        setAds(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApprovedAds();
  }, []);

  return (
    <div>
      <h2>Homepage - Approved Ads</h2>
      <div>
        {ads.map((ad) => (
          <div key={ad._id}>
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} width="200" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

