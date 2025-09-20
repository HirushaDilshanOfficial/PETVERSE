import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router";

const CartPage = () => {
  const { cart, subtotal, updateCartItem, removeCartItem } = useContext(CartContext);
  const navigate = useNavigate();

  console.log("CartPage - Cart data:", cart); // Debug log
  console.log("CartPage - Subtotal:", subtotal); 

  const handleProceedToCheckout = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  // Check if cart is properly initialized
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold text-[#1E40AF] mb-4">Your cart</h1>
        <p className="text-gray-600">Your cart is currently empty.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 rounded-full font-semibold text-white bg-[#1E40AF] hover:bg-[#F97316] transition-colors"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1E40AF] mb-8">Your cart</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Cart Items Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md mb-8 lg:mb-0">
            {cart.map((item) => (
              <div
                key={item.productId || item.productID}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || item.pImage || "https://placehold.co/100x100?text=No+Image"}
                    alt={item.name || item.pName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="font-semibold text-lg text-[#1E40AF]">{item.name || item.pName}</h2>
                    <p className="text-gray-700">Rs.{item.price || item.pPrice}</p>
                    <button
                      onClick={() => navigate(`/products/${item.productId || item.productID}`)}
                      className="mt-2 text-sm text-[#1E40AF] hover:text-[#F97316] transition-colors underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                    <button
                      onClick={() => updateCartItem(item.productId || item.productID, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="bg-white text-gray-800 px-3 py-2 text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(item.productId || item.productID, parseInt(e.target.value))
                      }
                      className="w-12 text-center border-l border-r border-gray-300 py-2 focus:outline-none bg-white"
                      min="1"
                    />
                    <button
                      onClick={() => updateCartItem(item.productId || item.productID, item.quantity + 1)}
                      className="bg-white text-gray-800 px-3 py-2 text-lg hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeCartItem(item.productId || item.productID)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-[#1E40AF]">Rs {subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Taxes and shipping calculated at checkout</p>

            {/* Note Section */}
            <div className="mt-6">
              <h3 className="text-gray-700 font-semibold mb-2">Add a note to your order</h3>
              <textarea
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E40AF] bg-white"
                placeholder="Order note"
              ></textarea>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 rounded-md font-bold text-white bg-[#1E40AF] hover:bg-[#F97316] transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;