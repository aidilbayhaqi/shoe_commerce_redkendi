import { Product } from "../types/product";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

interface Props{
  product: Product
}
const BASE_URL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:8000";
const ProductCard = memo(({ product }:Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer"
     onClick={() => navigate(`/products/${product.id}`)}>
      <div className="relative w-full h-50">
      <img
        src={`${BASE_URL}${product.image_url}`}
        alt={product.name}
        loading="lazy"
        className="w-full h-60 object-cover mb-2 rounded"
      />

      </div>
      <div className="p-4 flex flex-col justify-between h-40">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{product.name}</h3>
      <p className="text-green-500 font-bold mt-1">
       RP {product.price.toLocaleString("id-ID")}
      </p>
     <p className="text-sm text-gray-600 dark:text-gray-300">
      Type: {product.type?.map((t) => t.name).join(", ") || "N/A"}
    </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Color: {product.color || "N/A"}
      </p>

      </div>

    </div>
  );
});

export default ProductCard;
