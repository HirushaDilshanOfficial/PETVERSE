import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({ product, onAdd }) => {
  console.log("ProductCard received product:", product);
  
  // Handle add to cart click
  const handleAdd = () => {
    const available = Number(product?.pQuantity) || 0;

    if (available <= 0) {
      toast.error("There's no stock left");
      return;
    }

    if (!onAdd) {
      console.warn("onAdd function not provided");
      return;
    }

    onAdd(product);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-[#1E40AF]/20">
      <img
        src={product.pImage || product.image || "https://via.placeholder.com/150"}
        alt={product.pName || "Product"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="font-bold text-lg mb-2 text-[#1E40AF]">
          {product.pName || "Unnamed Product"}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          {product.pdescription || product.pDescription || "No description available"}
        </p>
        <p className="font-semibold text-[#F97316] mb-2">
          Rs. {product.pPrice ?? 0}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Available stocks: {product.pQuantity ?? 0}
        </p>

        <div className="flex flex-col gap-2">
          {/* View Product Button */}
          <Link
            to={`/products/${product.productID ?? ""}`}
            className="bg-[#1E40AF] text-white px-4 py-2 rounded-md hover:bg-[#F97316] transition text-center"
          >
            View Details
          </Link>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            aria-disabled={(Number(product?.pQuantity) || 0) === 0}
            title={(Number(product?.pQuantity) || 0) === 0 ? "There's no stock left" : "Add to Cart"}
            className="bg-[#1E40AF] text-white px-4 py-2 rounded-md hover:bg-[#F97316] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Default props in case product or onAdd is not provided
ProductCard.defaultProps = {
  product: {},
  onAdd: null,
};

export default ProductCard;