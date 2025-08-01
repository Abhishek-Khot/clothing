import React, { useState } from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { createCartItem } from "@/lib/utils/cartUtils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Toast from "@/components/ui/toast";

type ProductCardWithCartProps = {
  data: Product;
};

const ProductCardWithCart = ({ data }: ProductCardWithCartProps) => {
  const dispatch = useAppDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Generate a random rating between 3.5 and 5.0 for display
  const randomRating = Math.random() * (5.0 - 3.5) + 3.5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    const cartItem = createCartItem(data, 1);
    dispatch(addToCart(cartItem));
    
    // Show success toast
    setShowToast(true);
    
    // Reset loading state after a short delay
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  return (
    <div className="flex flex-col items-start aspect-auto group">
      <Link
        href={`/shop/product/${data._id || data.id}/${data.title.split(" ").join("-")}`}
        className="w-full"
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
      
      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full mt-2 bg-black hover:bg-gray-800 text-white text-sm py-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        {isAddingToCart ? (
          "Adding..."
        ) : (
          <>
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </>
        )}
      </Button>
      
      {/* Toast Notification */}
      <Toast
        message={`${data.title} added to cart!`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ProductCardWithCart; 