// Pages/PaymentPage.jsx
import { useLocation, useNavigate } from "react-router";
import PaymentForm from "../Components/PaymentForm";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from navigation state
  const { orderID, amount, userEmail } = location.state || {};

  // If user comes here without order data → redirect back
  if (!orderID || !amount || !userEmail) {
    navigate("/checkout");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PaymentForm orderID={orderID} amount={amount} userEmail={userEmail} />
    </div>
  );
};

export default PaymentPage;
