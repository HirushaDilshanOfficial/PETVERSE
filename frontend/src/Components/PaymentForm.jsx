import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const PaymentForm = ({ orderID, amount, userEmail }) => {
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    rememberCard: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/send-otp`, {
        email: userEmail,
        orderID,
        cardDetails: formData, // optional, if you want to store temporarily
      });
      setOtpSent(true);
      setMessage("OTP sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: userEmail,
        otp,
        orderID,
      });
      setMessage(res.data.message || "OTP verified!");
      // Navigate to order success page with order details
      navigate("/order-success", { state: { orderID, amount } });
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">PETVERSE</h2>
      <p className="text-gray-500 text-sm">New Kandy Road, Malabe</p>

      <div className="my-4">
        <p className="text-2xl font-bold text-gray-900">Rs {amount}.00</p>
      </div>

      {!otpSent ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOTP();
          }}
        >
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on card"
            value={formData.nameOnCard}
            onChange={handleChange}
            className="w-full border-b p-2 outline-none"
            required
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength="16"
            className="w-full border-b p-2 outline-none"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              className="w-1/2 border-b p-2 outline-none"
              required
            />
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="3"
              className="w-1/2 border-b p-2 outline-none"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="rememberCard"
              checked={formData.rememberCard}
              onChange={handleChange}
              className="h-4 w-4 text-[#F97316] focus:ring-[#F97316]"
            />
            Remember my card
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E40AF] text-white py-3 rounded-xl font-semibold hover:bg-[#1E3A8A] transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Pay"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={otp}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border-b p-2 outline-none"
          />
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-[#1E40AF] text-white py-3 rounded-xl font-semibold hover:bg-[#1E3A8A] transition disabled:opacity-50"
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default PaymentForm;
