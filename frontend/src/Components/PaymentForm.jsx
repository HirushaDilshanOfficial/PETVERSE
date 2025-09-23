import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Validation functions
const validateCardName = (name) => {
  // Only allow letters and spaces
  return /^[a-zA-Z\s]*$/.test(name);
};

const validateCardNumber = (number) => {
  // Only allow digits and between 12-16 digits
  return /^\d{12,16}$/.test(number);
};

// Updated validation function for date picker
const validateExpiryDate = (expiry) => {
  // For date picker, we receive a date string in YYYY-MM-DD format
  if (!expiry) return false;
  
  const selectedDate = new Date(expiry);
  const today = new Date();
  
  // Reset time part for comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Check if selected date is in the future
  return selectedDate >= today;
};

const validateCVV = (cvv) => {
  // Only allow exactly 3 digits
  return /^\d{3}$/.test(cvv);
};

const validateOTP = (otp) => {
  // Only allow exactly 6 digits
  return /^\d{6}$/.test(otp);
};

const PaymentForm = ({ orderID, amount, userEmail }) => {
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "", // Will now store date in YYYY-MM-DD format
    cvv: "",
    rememberCard: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let filteredValue = value;

    // Apply validation based on field type
    switch (name) {
      case "nameOnCard":
        // Only allow letters and spaces
        if (!validateCardName(value)) return;
        break;
      case "cardNumber":
        // Only allow digits and limit to 16 characters
        filteredValue = value.replace(/\D/g, "").slice(0, 16);
        break;
      case "cvv":
        // Only allow digits and limit to 3 characters
        filteredValue = value.replace(/\D/g, "").slice(0, 3);
        break;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : filteredValue,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    const filteredValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(filteredValue);
    
    // Clear error for OTP field when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: "" }));
    }
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

  //  Generate PDF Invoice 
  const generatePdf = async (order) => {
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
      doc.text("Invoice", 105, 20, { align: "center" });

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
      doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`, 14, 101);
      doc.text(`Payment Status: ${order.paymentStatus || 'N/A'}`, 14, 108);
      doc.text(`Subtotal: Rs.${(order.totalAmount - 300) || 0}`, 14, 115);
      doc.text(`Delivery Fee: Rs.300`, 14, 122);
      doc.text(`Total Amount: Rs.${order.totalAmount || 0}`, 14, 129);

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
        startY: 140,
        theme: "grid",
        headStyles: { fillColor: "#1E40AF", textColor: 255 },
        alternateRowStyles: { fillColor: "#F3F4F6" },
      });

      // Footer
      doc.setFontSize(12);
      doc.setTextColor(0);
      const finalY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 140;
      doc.text(
        "Thank you for your purchase!",
        105,
        finalY + 20,
        { align: "center" }
      );

      // Save the PDF instead of opening in new tab
      doc.save(`invoice_${order._id}.pdf`);
    } catch (error) {
      console.error("Error in PDF generation:", error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  // Validate form before sending OTP
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = "Cardholder name is required";
    } else if (!validateCardName(formData.nameOnCard)) {
      newErrors.nameOnCard = "Cardholder name can only contain letters";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be between 12-16 digits";
    }

    if (!formData.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (!validateExpiryDate(formData.expiry)) {
      newErrors.expiry = "Please select a future expiry date";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "CVV must be exactly 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPForm = () => {
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!validateOTP(otp)) {
      newErrors.otp = "OTP must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!validateForm()) {
      setMessage("Please fix the validation errors before proceeding");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/send-otp`, {
        email: userEmail,
        orderID,
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
    if (!validateOTPForm()) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/orders/verify-otp`, {
        orderID,
        otp,
      });
      
      const { order } = res.data;
      setMessage(res.data.message || "OTP verified!");
      
      // Generate PDF with error handling
      try {
        await generatePdf(order);
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        // Continue with navigation even if PDF generation fails
        alert("Payment successful, but there was an issue generating the invoice.");
      }
      
      // Navigate to home page instead of /order-success since that route doesn't exist
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display (convert YYYY-MM-DD to MM/YY)
  const formatExpiryDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };

  // Get minimum date for date picker (today)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
          <div>
            <input
              type="text"
              name="nameOnCard"
              placeholder="Name on card"
              value={formData.nameOnCard}
              onChange={handleInputChange}
              className={`w-full border-b p-2 outline-none ${errors.nameOnCard ? 'border-red-500' : ''}`}
              required
            />
            {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
          </div>
          
          <div>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={`w-full border-b p-2 outline-none ${errors.cardNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="date"
                name="expiry"
                value={formData.expiry}
                onChange={handleInputChange}
                min={getMinDate()}
                className={`w-full border-b p-2 outline-none ${errors.expiry ? 'border-red-500' : ''}`}
                required
              />
              {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              <p className="text-xs text-gray-500 mt-1">Select expiry date</p>
            </div>
            
            <div className="w-1/2">
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleInputChange}
                className={`w-full border-b p-2 outline-none ${errors.cvv ? 'border-red-500' : ''}`}
                required
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>
          
          {formData.expiry && (
            <div className="text-sm text-gray-600">
              Card expires on: {formatExpiryDate(formData.expiry)}
            </div>
          )}
          
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="rememberCard"
              checked={formData.rememberCard}
              onChange={handleInputChange}
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
          <div>
            <input
              type="text"
              value={otp}
              placeholder="Enter OTP"
              onChange={handleOtpChange}
              className={`w-full border-b p-2 outline-none ${errors.otp ? 'border-red-500' : ''}`}
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
          </div>
          
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
        <p className={`mt-4 text-center text-sm font-medium ${message.includes('error') || message.includes('failed') || message.includes('Failed') ? 'text-red-500' : 'text-gray-700'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PaymentForm;