import Product from "../Models/Product.js";

// Initialize cart in session
const initCart = (req) => {
  if (!req.session.cart) req.session.cart = [];
};

// Calculate totals
const calculateTotals = (cart) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  return { subtotal, total };
};

// Get cart
export async function getCart(req, res) {
  initCart(req);
  const { subtotal, total } = calculateTotals(req.session.cart);
  res.json({ cart: req.session.cart, subtotal, total });
}

// Add item to cart
export async function addToCart(req, res) {
  try {
    initCart(req);
    const { productID, quantity = 1 } = req.body;

    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = req.session.cart.find(item => item.productId === productID);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({
        productId: product.productID,
        name: product.pName,
        price: product.pPrice ?? 0,
        quantity
      });
    }

    const { subtotal, total } = calculateTotals(req.session.cart);
    res.status(200).json({ message: "Item added", cart: req.session.cart, subtotal, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update item quantity
export async function updateCartItem(req, res) {
  initCart(req);
  const { productId } = req.params;
  const { quantity } = req.body;

  const item = req.session.cart.find(i => i.productId === productId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;

  const { subtotal, total } = calculateTotals(req.session.cart);
  res.json({ message: "Cart updated", cart: req.session.cart, subtotal, total });
}

// Remove item from cart
export async function removeCartItem(req, res) {
  initCart(req);
  const { productId } = req.params;
  req.session.cart = req.session.cart.filter(i => i.productId !== productId);

  const { subtotal, total } = calculateTotals(req.session.cart);
  res.json({ message: "Item removed", cart: req.session.cart, subtotal, total });
}

// Clear cart
export async function clearCart(req, res) {
  req.session.cart = [];
  res.json({ message: "Cart cleared", cart: [], subtotal: 0, total: 0 });
}
