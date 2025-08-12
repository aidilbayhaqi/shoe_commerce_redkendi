// src/hooks/useProductFilter.ts
import { useMemo, useState } from "react";
import { Product } from "../types/product";
import { useDebounce } from "../hooks/useDebounce";

export function useProductFilter(products: Product[]) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState<number | null>(null);
  const [colorFilter, setColorFilter] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999999]);

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

      if (typeFilter) {
    result = result.filter((p) =>
      Array.isArray(p.type)
        ? p.type.some((t) => t && typeof t === "object" && "name" in t && (t as { name?: string }).name === typeFilter)
        : p.type && typeof p.type === "object" && "name" in p.type && (p.type as { name?: string }).name === typeFilter
    );
  }
    if (ageFilter !== null) {
      result = result.filter((p) => p.age === ageFilter);
    }

    if (colorFilter) {
      result = result.filter(
        (p) =>
          typeof p.color === "string" &&
          p.color.toLowerCase() === colorFilter.toLowerCase()
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return result;
  }, [products, debouncedSearch, typeFilter, ageFilter, colorFilter, priceRange]);

  return {
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
  };
}
