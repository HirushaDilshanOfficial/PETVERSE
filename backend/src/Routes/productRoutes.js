import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../Controllers/productController.js";
import { authenticateUser, requireAdmin } from "../Middleware/auth.js";
import { uploadSingleFile } from "../Middleware/fileUpload.js";

const router = express.Router();

// All product routes require admin authentication
// Get all products
router.get("/", authenticateUser, requireAdmin, getAllProducts);

// Get product by ID
router.get("/:productId", authenticateUser, requireAdmin, getProductById);

// Create new product (with file upload support)
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  uploadSingleFile,
  createProduct
);

// Update product (with file upload support)
router.put(
  "/:productId",
  authenticateUser,
  requireAdmin,
  uploadSingleFile,
  updateProduct
);

// Delete product
router.delete("/:productId", authenticateUser, requireAdmin, deleteProduct);

// Toggle product status
router.put(
  "/:productId/status",
  authenticateUser,
  requireAdmin,
  toggleProductStatus
);

export default router;