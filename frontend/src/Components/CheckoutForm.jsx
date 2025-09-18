import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

const DELIVERY_FEE = 300;

const inputBase =
  "block w-full bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E40AF] disabled:bg-white disabled:text-gray-900 disabled:opacity-100";

const CheckoutForm = ({ userID, onPlaceOrder }) => {
  const { cart, subtotal } = useContext(CartContext);
  const totalWithDelivery = (Number(subtotal) || 0) + DELIVERY_FEE;

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [shippingAddress, setShippingAddress] = useState({ ...billingAddress });
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Prefill user info
  useEffect(() => {
    const fetchUser = async () => {
      if (!userID) return;
      try {
        const res = await axios.get(`http://localhost:5001/api/users/${userID}`, { withCredentials: true });
        const user = res.data || {};
        const prefill = {
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          street: "",
          city: "",
          postalCode: "",
          country: "",
        };
        setBillingAddress(prefill);
        setShippingAddress(prefill);
      } catch (e) {
        console.error("Failed to fetch user info", e);
      }
    };
    fetchUser();
  }, [userID]);

  useEffect(() => {
    if (sameAsBilling) setShippingAddress({ ...billingAddress });
  }, [sameAsBilling, billingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      orderID: null, // backend will generate
      amount: totalWithDelivery,
      userEmail: billingAddress.email,
      billingAddress,
      shippingAddress,
      paymentMethod,
      cartItems: cart,
    };

    onPlaceOrder(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Billing Address */}
      <div className="space-y-3">
        <h2 className="font-semibold mb-2">Billing Address</h2>
        <input
          type="text"
          placeholder="Full Name"
          className={inputBase}
          value={billingAddress.fullName}
          onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className={inputBase}
          value={billingAddress.email}
          onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className={inputBase}
          value={billingAddress.phone}
          onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Street"
          className={inputBase}
          value={billingAddress.street}
          onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className={inputBase}
          value={billingAddress.city}
          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Postal Code"
          className={inputBase}
          value={billingAddress.postalCode}
          onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
        />
      </div>

      {/* Shipping Address */}
      <div className="space-y-3">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <label className="inline-flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF]"
          />
          Same as billing address
        </label>
        <input
          type="text"
          placeholder="Full Name"
          className={inputBase}
          value={shippingAddress.fullName}
          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
          disabled={sameAsBilling}
        />
        <input
          type="email"
          placeholder="Email"
          className={inputBase}
          value={shippingAddress.email}
          onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
          disabled={sameAsBilling}
        />
        <input
          type="text"
          placeholder="Phone"
          className={inputBase}
          value={shippingAddress.phone}
          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
          disabled={sameAsBilling}
        />
        <input
          type="text"
          placeholder="Street"
          className={inputBase}
          value={shippingAddress.street}
          onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
          disabled={sameAsBilling}
        />
        <input
          type="text"
          placeholder="City"
          className={inputBase}
          value={shippingAddress.city}
          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
          disabled={sameAsBilling}
        />
        <input
          type="text"
          placeholder="Postal Code"
          className={inputBase}
          value={shippingAddress.postalCode}
          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
          disabled={sameAsBilling}
        />
      </div>

      {/* Cart Summary */}
      <div>
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>Rs.{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between mt-2 font-bold">
          <span>Total (with delivery):</span>
          <span>Rs.{totalWithDelivery}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <label className="block mb-2 font-semibold">Payment Method</label>
        {["online", "bank_transfer", "cod"].map((method) => (
          <label key={method} className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF]"
            />
            <span>
              {method === "online"
                ? "Online Payment"
                : method === "bank_transfer"
                ? "Bank Transfer"
                : "Cash on Delivery (COD)"}
            </span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-[#1E40AF] hover:bg-[#F97316] text-white px-6 py-2 rounded transition-colors mt-4"
      >
        Place Order
      </button>
    </form>
  );
};

export default CheckoutForm;
