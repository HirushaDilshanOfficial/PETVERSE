import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const BankTransferPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderID } = location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use environment variable for API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  useEffect(() => {
    if (!orderID) {
      alert("No order found!");
      navigate("/checkout");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/${orderID}`, {
          withCredentials: true,
        });
        setOrder(res.data.order); // expects { totalAmount, billingAddress, items, ... }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        alert("Failed to retrieve order details.");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderID, navigate]);

  if (loading) return <div className="text-center mt-20">Loading order details...</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-[black] mb-6 text-center">
          Bank Transfer Instructions
        </h1>

        <p className="mb-4 text-gray-700">
          Please transfer the total amount to the following bank account:
        </p>

        <div className="border p-4 rounded-lg mb-6 bg-gray-50">
          <p><span className="font-semibold">Bank Name:</span> People's Bank</p>
          <p><span className="font-semibold">Account Name:</span> Petverse Pvt Ltd</p>
          <p><span className="font-semibold">Account Number:</span> 1234567890</p>
          <p><span className="font-semibold">Branch:</span> Colombo Main</p>
          <p><span className="font-semibold">Total Payable:</span> Rs.{order.totalAmount}</p>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          After completing the transfer, please email the payment slip to{" "}
          <span className="font-semibold">mailtopetverse@gmail.com</span> with your
          order ID <span className="font-semibold">{order._id}</span>.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#1E40AF] hover:bg-[#F97316] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BankTransferPage;