import { Product } from "@/types/product.types";
import { CartItem } from "@/lib/features/carts/cartsSlice";

export const createCartItem = (
  product: Product, 
  quantity: number = 1, 
  selectedSize?: string
): CartItem => {
  return {
    _id: product._id || product.id,
    title: product.title,
    srcUrl: product.srcUrl,
    price: product.price,
    category: product.category,
    sizes: product.sizes,
    discount: product.discount,
    quantity,
    selectedSize,
  };
};

export const calculateProductPrice = (product: Product): number => {
  const basePrice = product.price;
  if (product.discount.percentage > 0) {
    return Math.round(basePrice - (basePrice * product.discount.percentage) / 100);
  }
  if (product.discount.amount > 0) {
    return Math.round(basePrice - product.discount.amount);
  }
  return basePrice;
};

export const formatPrice = (price: number): string => {
  return `₹${price}`;
}; 