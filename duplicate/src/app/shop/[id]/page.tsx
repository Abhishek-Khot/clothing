"use client";
import React from "react";
import { notFound } from "next/navigation";

async function fetchProduct(id: string) {
  const res = await fetch(`http://localhost:5000/api/products/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.success) return null;
  return data.data;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  if (!product) return notFound();
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.srcUrl];
  const finalPrice = product.price - (product.discount?.amount || 0);
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex-1 flex flex-col gap-4 items-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {gallery.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={product.title}
                className="h-32 w-32 object-cover rounded border border-indigo-100 shadow"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">{product.title}</h1>
          <div>
            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {product.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(product.sizes || []).map((size: string) => (
              <span key={size} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                {size}
              </span>
            ))}
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="line-through text-gray-400 text-lg">₹{product.price.toFixed(2)}</span>
            <span className="font-bold text-2xl text-indigo-800">₹{finalPrice}</span>
            {product.discount?.amount > 0 && (
              <span className="text-green-600 text-sm">({product.discount.percentage}% OFF)</span>
            )}
          </div>
          <p className="text-gray-700 mt-2">{product.description}</p>
        </div>
      </div>
    </main>
  );
}
