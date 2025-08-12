import { Dispatch, SetStateAction } from "react";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  typeFilter: string;
  setTypeFilter: Dispatch<SetStateAction<string>>;
  ageFilter: number | null;
  setAgeFilter: Dispatch<SetStateAction<number | null>>;
  colorFilter: string;
  setColorFilter: Dispatch<SetStateAction<string>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
}
 
const types = ["limited", "casual", "branded", "sporty", "formal", "vintage"];
const ages = [5, 10, 18];
const colors = ["red", "blue", "gray"];
const priceRanges: [string, [number, number]][] = [
  ["< 100k", [0, 100000]],
  ["100k - 300k", [100000, 300000]],
  ["300k - 500k", [300000, 500000]],
  ["> 500k", [500000, Infinity]],
];

export default function FilterBar({
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
}: Props) {
    
  return (
    <div className="mb-6 bg-white dark:bg-gray-900 p-4 min-h-screen rounded-md text black dark:text-white">
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full mb-4 p-2 px-3 rounded bg-white dark:bg-gray-700 text-white placeholder-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Type Filter */}
      <div className="mb-4 ">
        <span className="font-semibold mr-2">Type:</span>
        {types.map((type) => (
          <button
            key={type}
            className={`px-3 py-1 mb-3 mr-2 rounded ${
              typeFilter === type ? "bg-purple-600" : "bg-white dark:bg-gray-700"
            }`}
            onClick={() => setTypeFilter(typeFilter === type ? "" : type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Age Filter */}
      <div className="mb-4">
        <span className="font-semibold mr-2">Age:</span>
        {ages.map((age) => (
          <button
            key={age}
            className={`px-3 py-1 mb-3 mr-2 rounded ${
              ageFilter === age ? "bg-purple-600" : "bg-white dark:bg-gray-700"
            }`}
            onClick={() => setAgeFilter(ageFilter === age ? null : age)}
          >
            {age}+
          </button>
        ))}
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <span className="font-semibold mr-2">Color:</span>
        {colors.map((color) => (
          <button
            key={color}
            className={`px-3 py-1 mb-3 mr-2 rounded ${
              colorFilter === color ? "bg-purple-600" : "bg-white dark:bg-gray-700"
            }`}
            onClick={() => setColorFilter(colorFilter === color ? "" : color)}
          >
            {color}
          </button>
        ))}
      </div>

     {/* Price Range Filter */}
        <div className="mb-4">
        <span className="font-semibold mr-2">Price:</span>
        {priceRanges.map(([label, range]) => (
            <button
            key={label}
            className={`px-3 py-1 mb-3 mr-2  rounded ${
                priceRange[0] === range[0] && priceRange[1] === range[1]
                ? "bg-purple-600"
                : "bg-white dark:bg-gray-700"
            }`}
            onClick={() =>
                setPriceRange(
                priceRange[0] === range[0] && priceRange[1] === range[1]
                    ? [0, Infinity] // toggle off
                    : range
                )
            }
            >
            {label}
            </button>
        ))}
        </div>

    </div>
  );
}
