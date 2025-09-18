import express from "express"
import { getAllProducts } from "../Controllers/productController.js";
import { getProductById } from "../Controllers/productController.js"; 

const router = express.Router();


router.get("/", getAllProducts);
router.get("/:id", getProductById);


export default router;

//app.post("/", createProduct);
//app.put("/:id", updateProduct);
//app.delete("/:id", deleteProduct);
