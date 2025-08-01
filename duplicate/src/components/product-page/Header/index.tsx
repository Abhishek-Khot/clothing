import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

const Header = ({ data }: { data: Product }) => {
  // Add this line for random rating
  const randomRating = Math.random() * (5.0 - 3.5) + 3.5;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          {/* ... existing title code ... */}
          
          {/* Update rating to use randomRating instead of data.rating
           */}
           <strong className="text-black xl:text-10xl">{data.title}</strong>
           <p></p>
          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={randomRating}  // Changed from data.rating
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={35}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {randomRating.toFixed(1)} 
              <span className="text-black/60">/5</span>
            </span>
          </div>
          
          {/* Add Available Sizes section after rating */}
          <div className="mb-3 sm:mb-3.5">
            <span className="text-black text-sm sm:text-base font-medium mr-2">Available Sizes:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.sizes && Array.isArray(data.sizes) ? data.sizes.map((size: string) => (
                <span key={size} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {size}
                </span>
              )) : <span className="text-black/60 text-sm">N/A</span>}
            </div>
          </div>

          {/* Update currency symbols from $ to ₹ in all price displays */}
          {/* ... existing price code but replace all $ with ₹ ... */}
          
          {/* Update description to use actual product description */}
          <p className="text-black text-sm sm:text-base font-medium mr-2 mb-5">
            {data.description || "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
          </p>
          
          <hr className="h-[1px] border-t-black/10 mb-5" />
          {/* Remove this line: <ColorSelection /> */}
          {/* Remove this line: <hr className="h-[1px] border-t-black/10 my-5" /> */}
          <SizeSelection sizes={data.sizes} />
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCardSection data={data} />
        </div>
      </div>
    </>
  );
};

export default Header;
