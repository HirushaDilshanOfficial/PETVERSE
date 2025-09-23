import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DELIVERY_FEE = 300;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, userEmail, paymentData } = location.state || {};

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
      doc.text(`Payment Date: ${payment?.paidAt ? new Date(payment.paidAt).toLocaleString() : new Date().toLocaleString()}`, 14, 129);
      doc.text(`Subtotal: Rs.${(order.totalAmount - DELIVERY_FEE) || 0}`, 14, 136);
      doc.text(`Delivery Fee: Rs.${DELIVERY_FEE}`, 14, 143);
      doc.text(`Total Amount: Rs.${order.totalAmount || 0}`, 14, 150);

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
        startY: 160,
        theme: "grid",
        headStyles: { fillColor: "#1E40AF", textColor: 255 },
        alternateRowStyles: { fillColor: "#F3F4F6" },
      });

      // Footer
      doc.setFontSize(12);
      doc.setTextColor(0);
      const finalY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 160;
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

  useEffect(() => {
    // If we have order and payment data, generate the PDF
    if (order && paymentData) {
      generatePdf(order, paymentData)
        .then(() => {
          // Show success message
          alert("Payment Successful! Receipt has been downloaded.");
        })
        .catch((error) => {
          console.error("Error generating receipt:", error);
          alert("Payment successful, but there was an issue generating the receipt.");
        });
    } else {
      // If no data, redirect to home
      navigate("/");
    }
  }, [order, paymentData, userEmail, navigate]);

  if (!order || !paymentData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Invalid Request</h1>
        <p className="text-lg mb-6">Payment data not found.</p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-[#1E40AF] text-white px-6 py-2 rounded hover:bg-[#1E3A8A]"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg mb-2">Thank you for your purchase.</p>
        <p className="text-md mb-6">A receipt has been downloaded to your device.</p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-[#1E40AF] text-white px-6 py-2 rounded hover:bg-[#1E3A8A]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;