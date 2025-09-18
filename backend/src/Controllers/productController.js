import Product from "../Models/Product.js"

export async function getAllProducts(req,res)  {
   try{
     const products = await Product.find().sort({createdAt:-1});
     res.status(200).json(products);
    }catch(error){
      console.error("Error in getAllProducts controller", error);
      res.status(500).json({ message: "Internal server error"});

   }
}

export async function getProductById(req, res){
   try{
       const product = await Product.findOne({ productID: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  
   }catch(error){
      console.error("Error in getProductById controller", error);
      res.status(500).json({ message: "Internal server error"});
   }
}

//export async function createProduct(req,res)  {
   //try{
      //  const { productID, pName, pdescription, pCategory, pPrice, pquantity, pImage, status} = req.body
      //  const product = new Product({productID, pName, pdescription, pCategory, pPrice, pquantity, pImage, status})

      //  const savedProduct = await product.save();
      // res.status(201).json(savedProduct);
   //}catch(error){
      //   console.error("Error in createProduct controller", error);
      //   res.status(500).json({ message: "Internal server error"}); 
   //}
//}

//export function updateProduct(req,res) {
   // try{
      //   const { productID, pName, pdescription, pCategory, pPrice, pquantity, pImage, status} = req.body;
      //   const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{productID, pName, pdescription, pCategory, pPrice, pquantity, pImage, status}, { new: true});
      
      // if(!updatedProduct) retuen res.status(404).json({ message: "Product not found"});
      
      //   res.status(200).json(updatedProduct);

   // }catch(error){
      //   console.error("Error in updatedProduct controller", error);
      //   res.status(500).json({ message: "Internal server error"}); 

   // }
//}

//export function deleteProduct(req,res) {
  // try{
      //   const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      
      // if(!updatedProduct) retuen res.status(404).json({ message: "Product not found"});
      
      //   res.status(200).json({ message: "Producted deleted successfully"});

   // }catch(error){
      //   console.error("Error in deletdProduct controller", error);
      //   res.status(500).json({ message: "Internal server error"}); 

   // }
//}