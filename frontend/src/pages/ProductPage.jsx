import { useState, useEffect, useContext } from "react";
import ProductCard from "../Components/ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../Components/RateLimitedUI";
import { CartContext } from "../contexts/CartContext";

const ProductPage = () => {
  console.log("ProductPage component loaded"); // Add this for debugging
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const { addToCart } = useContext(CartContext);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from API...");
        const res = await axios.get(`${API_BASE_URL}/products`);
        console.log("API Response:", res);
        
        // Fix: Access the products array from the response data
        const productsData = res.data.products || [];
        console.log("Products data:", productsData);
        
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map((p) => p.pCategory))];
        console.log("Categories:", uniqueCategories);
        setCategories(uniqueCategories);

        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        console.error("Error response:", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    console.log("Filtering products:", { products, selectedCategory, search });
    let tempProducts = [...products];

    if (selectedCategory) {
      tempProducts = tempProducts.filter(
        (p) => p.pCategory === selectedCategory
      );
    }

    if (search.trim() !== "") {
      tempProducts = tempProducts.filter((p) =>
        p.pName.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log("Filtered products:", tempProducts);
    setFilteredProducts(tempProducts);
  }, [search, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-white">
      {isRateLimited && <RateLimitedUI />}

      {/* Banner Section */}
<div className="relative w-full h-[100vh] overflow-hidden">
  <video
    src="/videos/pet2.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
      Find the Best Products for Your Pets 🐾
    </h1>
    <p className="text-lg text-gray-200 max-w-2xl">
      Explore our wide collection of pet supplies, food, and accessories.
    </p>
  </div>
</div>


      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-[#1E40AF] mb-6 text-center">
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer w-32 h-32 flex flex-col items-center justify-center rounded-xl shadow-md transition-transform transform hover:scale-105 ${
                selectedCategory === cat
                  ? "bg-[#1E40AF] text-white"
                  : "bg-[#F97316] text-white"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
                <span className="text-2xl">🐾</span>
              </div>
              <span className="font-semibold">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Clear Filter */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 border border-gray-300 rounded-lg p-2 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setSelectedCategory(null)}
            className="bg-[#EC4899] text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Clear Filter
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-[#1E40AF] py-10">
            Loading Products...
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productID}
                product={product}
                onAdd={(product) => addToCart(product.productID, 1)}
              />
            ))}
          </div>
        )}

        {/* No products found */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-10">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;