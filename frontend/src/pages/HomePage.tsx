import { useEffect, useMemo, useState } from "react";
import { Product } from "../types/product";
import { fetchProducts } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import ProductSlider from "../components/ProductSlider";
import { useProductFilter } from "../hooks/useFiltering";

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const {
    filtered,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    ageFilter,
    setAgeFilter,
    colorFilter,
    setColorFilter,
    priceRange,
    setPriceRange,
  } = useProductFilter(products);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <ProductSlider products={products} />
    <h1 className="text-2xl font-bold mb-4 text-blue-700">Daftar Produk</h1>
    <div className="w-full block md:flex justify-between items-start mb-6">
    <div className="pr-5 ">
      <FilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        ageFilter={ageFilter}
        setAgeFilter={setAgeFilter}
        colorFilter={colorFilter}
        setColorFilter={setColorFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
/>

    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * limit >= filtered.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductListPage;
