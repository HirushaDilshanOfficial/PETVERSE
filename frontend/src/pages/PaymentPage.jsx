// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";
import PaymentForm from "../Components/PaymentForm";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderID, amount, userEmail } = location.state || {};
  
  // Use environment variable for API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePay = async () => {
    try {
      setLoading(true);
      const token = await getAuth().currentUser.getIdToken();

      // Send both email and orderID as required by the backend
      await axios.post(
        `${API_BASE_URL}/send-otp`,
        { email: userEmail, orderID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/otp-verification", { state: { orderID, amount, userEmail } });
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP sending failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentForm
      orderID={orderID}
      amount={amount}
      userEmail={userEmail}
      formData={formData}
      onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
      onPay={handlePay}
      loading={loading}
      message={message}
    />
  );
};

export default PaymentPage;