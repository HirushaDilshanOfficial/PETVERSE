// Controllers/orderController.js
import Order from "../Models/Order.js";

//Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      userID,
      billingAddress,
      shippingAddress,
      pointsRedeemed,
      paymentMethod,
    } = req.body;

    // Pull cart from session
    const cart = req.session.cart || [];
    if (cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Calculate total
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.pPrice * item.pQuantity,
      0
    );

    // Validate payment method
    const validMethods = ["online", "bank_transfer", "cod"];
    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid or missing payment method" });
    }

    // Create new order
    const newOrder = new Order({
      userID,
      billingAddress,
      shippingAddress,
      items: cart,
      totalAmount,
      pointsRedeemed: pointsRedeemed || 0,
      paymentMethod,
    });

    await newOrder.save();

    // Clear session cart after checkout
    req.session.cart = [];

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userID } = req.params;

    const orders = await Order.find({ userID })
      .populate("userID", "fullName email phoneNumber") 
      .populate("items.productID", "name price"); 

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get all orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userID", "fullName email")
      .populate("items.productID", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
