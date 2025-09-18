import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productID: { type: String, required: true, unique: true },  
    pName: { type: String, required:true },   
    pdescription: { type: String},   
    pCategory: { type: String, required: true},
    pPrice: { type: Number, required: true},   
    pQuantity: { type: Number, required: true},  
    pImage: {type: String},  
    status: { 
      type: String, 
      enum:["active", "inactive"], 
      default: "active" 
    }, 
  }, 
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema)

export default Product;