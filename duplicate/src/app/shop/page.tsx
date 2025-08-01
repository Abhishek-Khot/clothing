"use client";
import React, { useEffect, useState } from "react";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Low Price", value: "price-asc" },
  { label: "High Price", value: "price-desc" },
];
const PAGE_SIZE = 12;

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function buildQuery() {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (sizes.length > 0) sizes.forEach(size => params.append("size", size));
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);
    params.append("page", page.toString());
    params.append("limit", PAGE_SIZE.toString());
    return params.toString();
  }

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${buildQuery()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pages);
          setTotal(data.total);
        } else {
          setError("Failed to load products");
        }
      } catch (e) {
        setError("Failed to load products");
      }
      setLoading(false);
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sizes, minPrice, maxPrice, sort, page]);

  function toggleSize(size: string) {
    setPage(1);
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }
  function clearFilters() {
    setCategory("");
    setSizes([]);
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          {/* Sidebar Filters */}
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters
              category={category}
              setCategory={(cat) => { setCategory(cat); setPage(1); }}
              sizes={sizes}
              toggleSize={toggleSize}
              minPrice={minPrice}
              setMinPrice={(price) => { setMinPrice(price); setPage(1); }}
              maxPrice={maxPrice}
              setMaxPrice={(price) => { setMaxPrice(price); setPage(1); }}
              clearFilters={clearFilters}
            />
          </div>
          {/* Main Product Grid */}
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">Shop</h1>
                <div className="flex items-center justify-between md:hidden mb-4">
                  <button
                    className="flex items-center px-3 py-2 border rounded text-black"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <FiSliders className="mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row gap-2">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {products.length} of {total} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select value={sort} onValueChange={val => { setSort(val); setPage(1); }}>
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Product Grid */}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {loading ? (
                <div className="col-span-full text-center py-10 text-lg text-gray-500">Loading products...</div>
              ) : error ? (
                <div className="col-span-full text-center py-10 text-lg text-red-500">{error}</div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-10 text-lg text-gray-500">No products found.</div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    data={{
                      id: product._id,
                      title: product.title,
                      srcUrl: product.srcUrl,
                      gallery: product.gallery,
                      price: product.price,
                      discount: product.discount,
                      rating: product.rating,
                      category: product.category,
                      description: product.description,
                      sizes: product.sizes,
                    }}
                    showAddToCart={false}
                  />
                ))
              )}
            </div>
            {/* Pagination */}
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                href="#"
                className="border border-black/10"
                onClick={e => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                aria-disabled={page === 1}
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      className={`text-black/50 font-medium text-sm ${page === i + 1 ? 'bg-indigo-100 text-indigo-700' : ''}`}
                      isActive={page === i + 1}
                      onClick={e => { e.preventDefault(); setPage(i + 1); }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 6 && <PaginationEllipsis className="text-black/50 font-medium text-sm" />}
              </PaginationContent>
              <PaginationNext
                href="#"
                className="border border-black/10"
                onClick={e => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                aria-disabled={page === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>
      {showMobileFilters && (
  <MobileFilters
    open={showMobileFilters}
    onClose={() => setShowMobileFilters(false)}
    category={category}
    setCategory={(cat) => { setCategory(cat); setPage(1); }}
    sizes={sizes}
    toggleSize={toggleSize}
    minPrice={minPrice}
    setMinPrice={(price) => { setMinPrice(price); setPage(1); }}
    maxPrice={maxPrice}
    setMaxPrice={(price) => { setMaxPrice(price); setPage(1); }}
    clearFilters={clearFilters}
  />
)}
    </main>
  );
}
