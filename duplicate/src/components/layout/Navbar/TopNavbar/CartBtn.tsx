"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import React, { useState } from "react";
import CartPopup from "./CartPopup";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative mr-[14px] p-1 hover:opacity-80 transition-opacity"
      >
        <Image
          priority
          src="/icons/cart.svg"
          height={100}
          width={100}
          alt="cart"
          className="max-w-[22px] max-h-[22px]"
        />
        {cart && cart.totalQuantities > 0 && (
          <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
            {cart.totalQuantities}
          </span>
        )}
      </button>
      
      <CartPopup 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default CartBtn;
