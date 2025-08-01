"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { addToCart, removeCartItem, remove } from "@/lib/features/carts/cartsSlice";
import { CartItem } from "@/lib/features/carts/cartsSlice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, Trash2 } from "lucide-react";

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { cart, adjustedTotalPrice } = useAppSelector((state: RootState) => state.carts);

  const handleAddItem = (item: CartItem) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleRemoveItem = (item: CartItem) => {
    dispatch(removeCartItem({ _id: item._id, selectedSize: item.selectedSize }));
  };

  const handleRemoveAll = (item: CartItem) => {
    dispatch(remove({ _id: item._id, selectedSize: item.selectedSize, quantity: item.quantity }));
  };

  const calculateItemPrice = (item: CartItem) => {
    const basePrice = item.price;
    const discountPrice = item.discount.percentage > 0
      ? Math.round(basePrice - (basePrice * item.discount.percentage) / 100)
      : item.discount.amount > 0
      ? Math.round(basePrice - item.discount.amount)
      : basePrice;
    return discountPrice * item.quantity;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Cart Popup */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">Your cart is empty</div>
              <Button onClick={onClose} className="bg-black hover:bg-gray-800">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={`${item._id}-${item.selectedSize}-${index}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.srcUrl.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${item.srcUrl}` : item.srcUrl}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-sm font-medium">
                      ₹{calculateItemPrice(item)}
                      {item.discount.percentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          ₹{item.price * item.quantity}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveAll(item)}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">₹{adjustedTotalPrice}</span>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full bg-black hover:bg-gray-800"
                onClick={() => {
                  // Navigate to checkout or cart page
                  window.location.href = '/cart';
                }}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPopup; 