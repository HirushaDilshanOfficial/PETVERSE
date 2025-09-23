// src/components/PaymentForm.jsx
import { useState } from "react";

const PaymentForm = ({ amount, formData, onChange, onPay, loading, message }) => {
  const [rememberPayment, setRememberPayment] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate single field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nameOnCard":
        if (!value) error = "Name on card is required";
        else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = "Invalid name format";
        break;

      case "cardNumber":
        if (!value) error = "Card number is required";
        else if (!/^\d{16}$/.test(value)) error = "Card number must be 16 digits";
        break;

      case "expiry":
        if (!value) error = "Expiry date is required";
        else {
          const [month, year] = value.split("/").map(Number);
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          if (
            !month ||
            !year ||
            month < 1 ||
            month > 12 ||
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          )
            error = "Invalid or expired card date";
        }
        break;

      case "cvv":
        if (!value) error = "CVV is required";
        else if (!/^\d{3,4}$/.test(value)) error = "Invalid CVV";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e); // update parent formData
    validateField(name, value); // validate immediately
  };

  // Final validation before Pay
  const handlePay = () => {
    // check all fields one more time
    let isValid = true;
    ["nameOnCard", "cardNumber", "expiry", "cvv"].forEach((field) => {
      validateField(field, formData[field] || "");
      if (errors[field]) isValid = false;
    });

    if (isValid) {
      onPay({ rememberPayment });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>
        <p className="mb-4 text-center font-semibold">Total Amount: Rs {amount}.00</p>

        {/* Payment images */}
        <div className="flex justify-center gap-4 mb-4">
          <img src="/images/visa.png" alt="Visa" className="h-10" />
          <img src="/images/mastercard.png" alt="MasterCard" className="h-10" />
        </div>

        {/* Name on Card */}
        <input
          name="nameOnCard"
          placeholder="Name on Card"
          value={formData.nameOnCard || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
        />
        {errors.nameOnCard && <p className="text-red-600 text-sm mb-2">{errors.nameOnCard}</p>}

        {/* Card Number */}
        <input
          name="cardNumber"
          placeholder="Card Number"
          maxLength={16}
          value={formData.cardNumber || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
        />
        {errors.cardNumber && <p className="text-red-600 text-sm mb-2">{errors.cardNumber}</p>}

        {/* Expiry & CVV */}
        <div className="flex gap-4 mb-1">
          <input
            name="expiry"
            placeholder="MM/YY"
            value={formData.expiry || ""}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
          <input
            name="cvv"
            placeholder="CVV"
            maxLength={4}
            value={formData.cvv || ""}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
          />
        </div>
        {errors.expiry && <p className="text-red-600 text-sm mb-1">{errors.expiry}</p>}
        {errors.cvv && <p className="text-red-600 text-sm mb-2">{errors.cvv}</p>}

        {/* Remember payment */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={rememberPayment}
            onChange={(e) => setRememberPayment(e.target.checked)}
            className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF]"
          />
          Remember my payment details for next time
        </label>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-[#1E40AF] hover:bg-[#2563EB] text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? "Sending OTP..." : "Pay"}
        </button>

        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentForm;