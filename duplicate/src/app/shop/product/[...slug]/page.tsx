"use client";
import React, { useEffect, useState } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";

// Fallback data for related section (can keep static for now)
import { relatedProductData } from "@/app/page";

export default function ProductPage({ params }: { params: { slug: string[] } }) {
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.slug[0]}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (json.success) {
          console.log("Product data loaded:", json.data);
          setProductData(json.data as Product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  // Fetch related products when product data is loaded
  useEffect(() => {
    async function fetchRelatedProducts() {
      if (!productData?.category) {
        console.log("No category found for product:", productData);
        return;
      }
      
      console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
      
      setRelatedLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("category", productData.category);
        params.append("limit", "4"); // Limit to 4 related products
        params.append("exclude", productData._id); // Exclude current product
        
        // Also try without exclude first to see if we get any products
        const testParams = new URLSearchParams();
        testParams.append("category", productData.category);
        testParams.append("limit", "10");
        
        console.log("Testing API with category:", productData.category);
        const testRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${testParams.toString()}`);
        if (testRes.ok) {
          const testJson = await testRes.json();
          console.log("Test API response (all products in category):", testJson);
        } else {
          console.log("Test API failed with status:", testRes.status);
        }
        
        // Also test without any filters
        const allProductsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (allProductsRes.ok) {
          const allProductsJson = await allProductsRes.json();
          console.log("All products response:", allProductsJson);
        }
        
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`;
        console.log("Fetching related products from:", apiUrl);
        console.log("Product category:", productData.category);
        console.log("Product ID to exclude:", productData._id);
        
        const res = await fetch(apiUrl);
        console.log("API response status:", res.status);
        
        if (res.ok) {
          const json = await res.json();
          console.log("API response data:", json);
          
          if (json.success && json.data.length > 0) {
            console.log("Found related products:", json.data.length);
            setRelatedProducts(json.data);
          } else {
            console.log("No related products found, showing empty state");
            setRelatedProducts([]);
          }
        } else {
          console.log("API call failed, showing empty state");
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        // Show empty state on error
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [productData]);

  if (!loading && !productData) {
    notFound();
  }

  if (loading || !productData) return null; // Could add spinner

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData.title} />
        <section className="mb-11">
          <Header data={productData} />
        </section>
        <Tabs />
      </div>
      <div className="mb-[50px] sm:mb-20">
        {relatedLoading ? (
          <div className="max-w-frame mx-auto text-center py-10">
            <div className="text-lg text-gray-500">Loading related products...</div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <ProductListSec 
            title="You might also like" 
            data={relatedProducts}
            showAddToCart={false}
          />
        ) : (
          <div className="max-w-frame mx-auto text-center py-10">
            <div className="text-lg text-gray-500">No related products found</div>
          </div>
        )}
      </div>
    </main>
  );
}
