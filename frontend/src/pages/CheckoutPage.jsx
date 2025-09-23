// src/pages/CheckoutPage.jsx
import { useNavigate } from "react-router";
import axios from "axios";
import CheckoutForm from "../Components/CheckoutForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DELIVERY_FEE = 500;

// ✅ Helper function to load logo
const loadImageAsDataUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// ✅ Generate PDF Invoice
const generatePdf = async (order, userEmail) => {
  try {
    const doc = new jsPDF();

    try {
      // Load logo - using the correct path and file extension
      const logoDataUrl = await loadImageAsDataUrl("/images/company-logo.jpg");
      doc.addImage(logoDataUrl, "JPEG", 14, 10, 40, 20);
    } catch (err) {
      console.warn("Failed to load logo, continuing without it:", err);
      // Continue without logo if it fails to load
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
      14, 74
    );
    doc.text(
      `Shipping: ${shippingAddress.fullName || ''}, ${shippingAddress.street || ''}, ${shippingAddress.city || ''}`,
      14, 81
    );

    // Payment info
    doc.setFontSize(14);
    doc.setTextColor("#1E40AF");
    doc.text("Payment Details:", 14, 94);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`, 14, 101);
    doc.text(`Payment Status: ${order.paymentStatus || 'N/A'}`, 14, 108);
    doc.text(`Subtotal: Rs.${(order.totalAmount - DELIVERY_FEE) || 0}`, 14, 115);
    doc.text(`Delivery Fee: Rs.${DELIVERY_FEE}`, 14, 122);
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

    doc.save(`invoice_${order._id}.pdf`);
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error; // Re-throw to be caught by the caller
  }
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Use environment variable for API base URL with better fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  
  // Log the API base URL for debugging
  console.log("API Base URL:", API_BASE_URL);

  // ✅ Handle Place Order
  const handlePlaceOrder = async (orderData) => {
    try {
      console.log("Placing order with data:", orderData);
      
      // Transform the frontend data to match backend expectations
      const transformedData = {
        billingAddress: orderData.billingAddress,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        // pointsRedeemed is optional, so we don't include it if not provided
      };

      console.log("Sending transformed data:", transformedData);

      const res = await axios.post(`${API_BASE_URL}/orders`, transformedData, {
        withCredentials: true,
      });

      console.log("Order response:", res.data);

      const { order, userEmail } = res.data;
      
      // Log the order details for debugging
      console.log("Order created:", order);
      console.log("User email:", userEmail);
      console.log("Payment method:", order.paymentMethod);

      if (order.paymentMethod === "online") {
        navigate("/payment", {
          state: { orderID: order._id, amount: order.totalAmount, userEmail },
        });
      } else if (order.paymentMethod === "bank_transfer") {
        navigate("/bank-transfer", {
          state: { orderID: order._id, amount: order.totalAmount, userEmail },
        });
      } else {
        // This should handle "cod" (Cash on Delivery)
        alert("✅ Order placed successfully with Cash on Delivery!");
        
        // Generate PDF with error handling
        try {
          await generatePdf(order, userEmail);
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          // Continue with navigation even if PDF generation fails
          alert("Order placed successfully, but there was an issue generating the invoice.");
        }
        
        // Navigate to home page instead of /success since that route doesn't exist
        navigate("/");
      }
    } catch (err) {
      // Better error handling to avoid "undefined" messages
      let errorMessage = "Failed to place order. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        console.log("Error response:", err.response);
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.statusText) {
          errorMessage = `Server error: ${err.response.statusText}`;
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        console.log("Error request:", err.request);
        errorMessage = "Network error. Please check your connection.";
      } else if (err.message) {
        // Something else happened
        console.log("Error message:", err.message);
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      console.error("Order placement error:", err);
    }
  };

  return <CheckoutForm onPlaceOrder={handlePlaceOrder} />;
};

export default CheckoutPage;