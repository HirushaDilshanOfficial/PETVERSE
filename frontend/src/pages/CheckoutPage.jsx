import { useNavigate } from "react-router";
import CheckoutForm from "../Components/CheckoutForm";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const userID = "64c3fda1f123...";

  // This function handles what happens when the user places the order
  const handlePlaceOrder = (orderData) => {
    if (orderData.paymentMethod === "online") {
      navigate("/payment", { state: orderData });
    } else {
      navigate("/success", { state: orderData });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center p-4">
          <img
            src="/images/company-logo.jpg"
            alt="Company Logo"
            className="w-12 h-12 mr-3"
          />
          <span className="text-2xl font-bold text-[#1E40AF]">PetVerse</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <CheckoutForm userID={userID} onPlaceOrder={handlePlaceOrder} />
      </main>
    </div>
  );
};

export default CheckoutPage;
