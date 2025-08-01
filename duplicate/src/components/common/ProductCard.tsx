import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  // Generate a random rating between 3.5 and 5.0 for display
  const randomRating = Math.random() * (5.0 - 3.5) + 3.5;

  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${data.srcUrl}` : data.srcUrl}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
      
      {/* Description */}
      {/* <p className="text-black/60 text-xs xl:text-sm mb-1 xl:mb-2 line-clamp-2">
        {data.description}
      </p> */}
      
      {/* Available Sizes */}
      {/* <div className="mb-1 xl:mb-2">
        <span className="text-black text-xs xl:text-sm mr-1">Sizes:</span>
        <span className="text-black/60 text-xs xl:text-sm">
          {data.sizes && Array.isArray(data.sizes) ? data.sizes.join(", ") : "N/A"}
        </span>
      </div> */}
      
      <div className="flex items-end mb-1 xl:mb-2">
        <Rating
          initialValue={randomRating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {randomRating.toFixed(1)}
          <span className="text-black/60">/5</span>
        </span>
      </div>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        {(() => {
          const hasPercentage = data.discount.percentage > 0;
          const hasAmount = data.discount.amount > 0;
          const finalPrice = hasPercentage
            ? Math.round(data.price - (data.price * data.discount.percentage) / 100)
            : hasAmount
            ? data.price - data.discount.amount
            : data.price;
          return (
            <>
              <span className="font-bold text-black text-xl xl:text-2xl">₹{finalPrice}</span>
              {(hasPercentage || hasAmount) && (
                <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
                  ₹{data.price}
                </span>
              )}
              {hasPercentage && (
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  -{data.discount.percentage}%
                </span>
              )}
              {!hasPercentage && hasAmount && (
                <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  -₹{data.discount.amount}
                </span>
              )}
            </>
          );
        })()}
      </div>
    </Link>
  );
};

export default ProductCard;
