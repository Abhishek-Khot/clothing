"use client";
import React, { useEffect, useState } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

// Fallback data for new arrivals (in case API fails)
export const newArrivalsData: Product[] = [
  {
    _id: "1",
    title: "T-shirt with Tape Details",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 120,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    category: "T-shirts",
    sizes: ["S", "M", "L"],
    description: "Comfortable t-shirt with tape details"
  },
  {
    _id: "2",
    title: "Skinny Fit Jeans",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 260,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
    category: "Jeans",
    sizes: ["30", "32", "34"],
    description: "Stylish skinny fit jeans"
  },
  {
    _id: "3",
    title: "Chechered Shirt",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    description: "Classic chechered shirt"
  },
  {
    _id: "4",
    title: "Sleeve Striped T-shirt",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 160,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 4.5,
    category: "T-shirts",
    sizes: ["S", "M", "L"],
    description: "Striped t-shirt with unique sleeve design"
  },
];

export const relatedProductData: Product[] = [
  {
    _id: "12",
    title: "Polo with Contrast Trims",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 242,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 4.0,
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    description: "Polo shirt with contrast trims"
  },
  {
    _id: "13",
    title: "Gradient Graphic T-shirt",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.5,
    category: "T-shirts",
    sizes: ["S", "M", "L"],
    description: "Gradient graphic t-shirt"
  },
  {
    _id: "14",
    title: "Polo with Tipping Details",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    description: "Polo shirt with tipping details"
  },
  {
    _id: "15",
    title: "Black Striped T-shirt",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 150,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 5.0,
    category: "T-shirts",
    sizes: ["S", "M", "L"],
    description: "Black striped t-shirt"
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Alex K.",
    content:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.”',
    rating: 5,
    date: "August 14, 2023",
  },
  {
    id: 2,
    user: "Sarah M.",
    content: `"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”`,
    rating: 5,
    date: "August 15, 2023",
  },
  {
    id: 3,
    user: "Ethan R.",
    content: `"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt."`,
    rating: 5,
    date: "August 16, 2023",
  },
  {
    id: 4,
    user: "Olivia P.",
    content: `"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out."`,
    rating: 5,
    date: "August 17, 2023",
  },
  {
    id: 5,
    user: "Liam K.",
    content: `"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion."`,
    rating: 5,
    date: "August 18, 2023",
  },
  {
    id: 6,
    user: "Samantha D.",
    content: `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
    rating: 5,
    date: "August 19, 2023",
  },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const params = new URLSearchParams();
        params.append("sort", "newest"); // Sort by newest first
        params.append("limit", "4"); // Limit to 4 products
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setNewArrivals(json.data);
          } else {
            // If no products found, use fallback data
            setNewArrivals(newArrivalsData);
          }
        } else {
          // If API call fails, use fallback data
          setNewArrivals(newArrivalsData);
        }
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        // Use fallback data on error
        setNewArrivals(newArrivalsData);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        {loading ? (
          <div className="max-w-frame mx-auto text-center py-10">
            <div className="text-lg text-gray-500">Loading new arrivals...</div>
          </div>
        ) : (
          <ProductListSec
            title="NEW ARRIVALS"
            data={newArrivals}
            viewAllLink="/shop#new-arrivals"
          />
        )}
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
