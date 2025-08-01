import React from "react";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  category: string;
  setCategory: (category: string) => void;
  sizes: string[];
  toggleSize: (size: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  clearFilters: () => void;
}

const CATEGORIES = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const Filters: React.FC<FiltersProps> = ({
  category,
  setCategory,
  sizes,
  toggleSize,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearFilters,
}) => {
  return (
    <>
      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">All</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Size Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <label key={size} className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
                checked={sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              <span className="ml-1 text-xs">{size}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Price Range</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-20 border rounded px-2 py-1"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-20 border rounded px-2 py-1"
          />
        </div>
      </div>
      
      <button
        className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </>
  );
};

export default Filters;
