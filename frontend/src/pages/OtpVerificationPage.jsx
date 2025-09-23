// src/pages/OtpVerificationPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DELIVERY_FEE = 300;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderID, amount, userEmail, paymentData } = location.state || {};
  
  // Use environment variable for API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes countdown
  const [resendDisabled, setResendDisabled] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setResendDisabled(false);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  //  Load logo from public folder as data URL 
  const loadImageAsDataUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        // Resolve with null if image fails to load
        resolve(null);
      };
    });
  };

  //  Generate PDF Invoice with Payment Details
  const generatePdf = async (order, payment) => {
    try {
      const doc = new jsPDF();

      try {
        // Load logo
        const logoDataUrl = await loadImageAsDataUrl("/images/company-logo.jpg");
        if (logoDataUrl) {
          doc.addImage(logoDataUrl, "JPEG", 14, 10, 40, 20);
        }
      } catch (err) {
        console.warn("Failed to load logo, continuing without it:", err);
      }

      // Header
      doc.setFontSize(18);
      doc.setTextColor("#1E40AF");
      doc.text("Payment Receipt", 105, 20, { align: "center" });

      // Website info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("PETVERSE", 14, 40);
      doc.text("Email: mailtopetverse@gmail.com", 14, 46);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 40);

      // Customer info
      doc.setFontSize(14);
      doc.setTextColor("#1E40AF");
      doc.text("Customer Details:", 14, 60);
      doc.setFontSize(12);
      doc.setTextColor(0);
      
      // Add safety checks for address data
      const billingAddress = order.billingAddress || {};
      const shippingAddress = order.shippingAddress || {};
      
      doc.text(`Email: ${userEmail || 'N/A'}`, 14, 67);
      doc.text(
        `Billing: ${billingAddress.fullName || ''}, ${billingAddress.street || ''}, ${billingAddress.city || ''}`,
        14,
        74
      );
      doc.text(
        `Shipping: ${shippingAddress.fullName || ''}, ${shippingAddress.street || ''}, ${shippingAddress.city || ''}`,
        14,
        81
      );

      // Payment info
      doc.setFontSize(14);
      doc.setTextColor("#1E40AF");
      doc.text("Payment Details:", 14, 94);
      doc.setFontSize(12);
      doc.setTextColor(0);
      
      // Payment details
      doc.text(`Payment ID: ${payment?.paymentID || 'N/A'}`, 14, 101);
      doc.text(`Transaction ID: ${payment?.transactionID || 'N/A'}`, 14, 108);
      doc.text(`Payment Method: ${order.paymentMethod || 'Online Payment'}`, 14, 115);
      doc.text(`Payment Status: ${payment?.status || 'Success'}`, 14, 122);
      doc.text(`Subtotal: Rs.${(order.totalAmount - DELIVERY_FEE) || 0}`, 14, 129);
      doc.text(`Delivery Fee: Rs.${DELIVERY_FEE}`, 14, 136);
      doc.text(`Total Amount: Rs.${order.totalAmount || 0}`, 14, 143);

      // Table of items
      const tableColumn = ["Product", "Quantity", "Price", "Total"];
      const tableRows = [];

      // Add safety check for items array
      const items = Array.isArray(order.items) ? order.items : [];
      
      items.forEach((item) => {
        const row = [
          item.name || 'Unknown Product',
          item.pQuantity || 0,
          `Rs.${(item.pPrice || 0).toFixed(2)}`,
          `Rs.${((item.pPrice || 0) * (item.pQuantity || 0)).toFixed(2)}`,
        ];
        tableRows.push(row);
      });

      // Use autoTable correctly
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 150,
        theme: "grid",
        headStyles: { fillColor: "#1E40AF", textColor: 255 },
        alternateRowStyles: { fillColor: "#F3F4F6" },
      });

      // Footer
      doc.setFontSize(12);
      doc.setTextColor(0);
      const finalY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 150;
      doc.text(
        "Thank you for your purchase!",
        105,
        finalY + 20,
        { align: "center" }
      );

      // Save the PDF instead of opening in new tab
      doc.save(`payment_receipt_${payment?.paymentID || order._id}.pdf`);
    } catch (error) {
      console.error("Error in PDF generation:", error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  //  Handle OTP Verification 
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const token = await getAuth().currentUser.getIdToken();

      console.log("=== OTP Verification Debug Info ===");
      console.log("userEmail:", userEmail);
      console.log("otp:", otp);

      // First verify OTP using the server endpoint
      const otpRes = await axios.post(
        `${API_BASE_URL}/verify-otp`,
        { email: userEmail, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("OTP verification response:", otpRes.data);

      // Get the verified order ID
      const verifiedOrderID = otpRes.data.orderID;
      
      console.log("Verified order ID:", verifiedOrderID);
      
      // Fetch the order details
      const orderRes = await axios.get(`${API_BASE_URL}/orders/${verifiedOrderID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const order = orderRes.data.order;
      
      console.log("Order details:", order);

      // Update order payment status to "Paid"
      const updateRes = await axios.put(`${API_BASE_URL}/orders/${verifiedOrderID}`, {
        paymentStatus: "Paid"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Order update response:", updateRes.data);

      // Navigate to success page with order and payment data
      navigate("/success", { 
        state: { 
          order,
          userEmail,
          paymentData: { 
            paymentID: "DEMO-" + Date.now(),
            transactionID: "TXN-" + Date.now(),
            amount: order.totalAmount,
            status: "success",
            paidAt: new Date()
          }
        } 
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      setMessage(err.response?.data?.message || "OTP verification failed.");
    }
  };

  // ] Handle Resend OTP 
  const handleResend = async () => {
    try {
      setMessage("");
      const token = await getAuth().currentUser.getIdToken();

      await axios.post(
        `${API_BASE_URL}/orders/resend-otp`,
        { orderID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimer(300);
      setResendDisabled(true);
      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">OTP Verification</h2>
        <p className="mb-2">
          Enter the OTP sent to your email: <b>{userEmail}</b>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border rounded-lg p-2 bg-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {resendDisabled ? (
            <p>Resend OTP in {formatTime(timer)}</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default OtpVerificationPage;