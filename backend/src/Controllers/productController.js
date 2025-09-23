import Product from "../Models/Product.js";
import { uploadToCloudinary } from "../Config/cloudinary.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    // Get all products from database
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product by ID
    const product = await Product.findOne({ productID: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    console.log("📥 Creating new product with data:", req.body);
    console.log("📁 File received:", req.file);

    const {
      productID,
      pName,
      pDescription,
      pCategory,
      pPrice,
      pQuantity,
      status,
    } = req.body;

    // Validate required fields
    if (
      !productID ||
      !pName ||
      !pDescription ||
      !pCategory ||
      !pPrice ||
      !pQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if product with same ID already exists
    const existingProduct = await Product.findOne({ productID });
    if (existingProduct) {
      console.log("❌ Product with ID already exists:", productID);
      return res.status(409).json({
        success: false,
        message: "Product with this ID already exists",
      });
    }

    // Handle image upload if file is provided
    let imageUrl = ""; // Default to empty string
    if (req.file) {
      console.log("☁️ Uploading image to Cloudinary...");
      try {
        // Upload file to Cloudinary
        const uploadResult = await uploadToCloudinary(
          req.file,
          "petverse/products"
        );
        imageUrl = uploadResult.url;
        console.log("✅ Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("❌ Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload product image",
          error: uploadError.message,
        });
      }
    }

    // Create new product
    const newProduct = new Product({
      productID,
      pName,
      pDescription,
      pCategory,
      pPrice: Number(pPrice),
      pQuantity: Number(pQuantity),
      pImage: imageUrl,
      status: status || "Active",
    });

    console.log("💾 Saving product to database...");
    // Save product to database
    const savedProduct = await newProduct.save();
    console.log("✅ Product saved successfully:", savedProduct._id);

    res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Handle image upload if file is provided
    if (req.file) {
      // Upload file to Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file,
        "petverse/products"
      );
      updateData.pImage = uploadResult.url;
    }

    // Find and update product
    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      updateData,
      { new: true } // Return updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and delete product
    const deletedProduct = await Product.findOneAndDelete({
      productID: productId,
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Toggle product status (Active/Inactive)
export const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product
    const product = await Product.findOne({ productID: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Toggle status
    const newStatus = product.status === "Active" ? "Inactive" : "Active";

    // Update product status
    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      { status: newStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: `Product ${newStatus.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle product status",
      error: error.message,
    });
  }
};
