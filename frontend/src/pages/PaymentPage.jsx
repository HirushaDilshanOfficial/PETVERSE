import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";
import PaymentForm from "../components/PaymentForm";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderID, amount, userEmail } = location.state || {};
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePay = async ({ rememberPayment }) => {
    try {
      setLoading(true);

      // Prepare demo payment data
      const paymentData = {
        orderID,
        amount,
        paymentType: "card",
        referenceId: "DEMO-" + Date.now(),
        cardDetails: formData, // optional for testing
      };


      
      console.log("=== Payment Debug Info ===");
      console.log("Sending payment data:", paymentData);

      // Call backend to save payment
      const response = await axios.post(
        "http://localhost:5001/api/payments/demo/pay",
        paymentData
      );

      console.log("Payment response:", response.data);

      setMessage(response.data.message);

      // Check if payment was successful
      if (response.data.status === "success") {
        // Send OTP after successful payment
        const token = await getAuth().currentUser.getIdToken();
        
        // Make sure both orderID and userEmail are provided
        if (!orderID || !userEmail) {
          throw new Error("Missing order ID or user email");
        }
        
        await axios.post(
          "http://localhost:5001/api/send-otp",
          { email: userEmail, orderID }, // Include both email and orderID
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Navigate to OTP verification with payment data
        navigate("/otp-verification", { 
          state: { 
            orderID, 
            amount, 
            userEmail,
            paymentData: response.data.payment // Pass payment data for PDF generation
          } 
        });
      } else {
        // Payment failed
        setMessage("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(err.response?.data?.message || err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentForm
      amount={amount}
      formData={formData}
      onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
      onPay={handlePay}
      loading={loading}
      message={message}
      userEmail={userEmail} // Pass userEmail as prop
      orderID={orderID} // Pass orderID as prop
    />
  );
};

export default PaymentPage;