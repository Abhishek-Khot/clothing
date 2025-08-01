import { compareArrays } from "@/lib/utils";
import { Discount } from "@/types/product.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const calcAdjustedTotalPrice = (
  totalPrice: number,
  data: CartItem,
  quantity?: number
): number => {
  return (
    (totalPrice + data.discount.percentage > 0
      ? Math.round(data.price - (data.price * data.discount.percentage) / 100)
      : data.discount.amount > 0
      ? Math.round(data.price - data.discount.amount)
      : data.price) * (quantity ? quantity : data.quantity)
  );
};

export type RemoveCartItem = {
  _id: string;
  selectedSize?: string;
};

export type CartItem = {
  _id: string;
  title: string;
  srcUrl: string;
  price: number;
  category: string;
  sizes: string[];
  discount: Discount;
  quantity: number;
  selectedSize?: string;
};

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

// Define a type for the slice state
interface CartsState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  action: "update" | "add" | "delete" | null;
}

// Define the initial state using that type
const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  adjustedTotalPrice: 0,
  action: null,
};

export const cartsSlice = createSlice({
  name: "carts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // if cart is empty then add
      if (state.cart === null) {
        state.cart = {
          items: [action.payload],
          totalQuantities: action.payload.quantity,
        };
        state.totalPrice =
          state.totalPrice + action.payload.price * action.payload.quantity;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice +
          calcAdjustedTotalPrice(state.totalPrice, action.payload);
        return;
      }

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload._id === item._id &&
          action.payload.selectedSize === item.selectedSize
      );

      if (isItemInCart) {
        state.cart = {
          ...state.cart,
          items: state.cart.items.map((eachCartItem) => {
            if (
              eachCartItem._id === action.payload._id &&
              eachCartItem.selectedSize === action.payload.selectedSize
            ) {
              return {
                ...isItemInCart,
                quantity: action.payload.quantity + isItemInCart.quantity,
              };
            }
            return eachCartItem;
          }),
          totalQuantities: state.cart.totalQuantities + action.payload.quantity,
        };
        state.totalPrice =
          state.totalPrice + action.payload.price * action.payload.quantity;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice +
          calcAdjustedTotalPrice(state.totalPrice, action.payload);
        return;
      }

      state.cart = {
        ...state.cart,
        items: [...state.cart.items, action.payload],
        totalQuantities: state.cart.totalQuantities + action.payload.quantity,
      };
      state.totalPrice =
        state.totalPrice + action.payload.price * action.payload.quantity;
      state.adjustedTotalPrice =
        state.adjustedTotalPrice +
        calcAdjustedTotalPrice(state.totalPrice, action.payload);
    },
    removeCartItem: (state, action: PayloadAction<RemoveCartItem>) => {
      if (state.cart === null) return;

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload._id === item._id &&
          action.payload.selectedSize === item.selectedSize
      );

      if (isItemInCart) {
        state.cart = {
          ...state.cart,
          items: state.cart.items
            .map((eachCartItem) => {
              if (
                eachCartItem._id === action.payload._id &&
                eachCartItem.selectedSize === action.payload.selectedSize
              ) {
                return {
                  ...isItemInCart,
                  quantity: eachCartItem.quantity - 1,
                };
              }
              return eachCartItem;
            })
            .filter((item) => item.quantity > 0),
          totalQuantities: state.cart.totalQuantities - 1,
        };

        state.totalPrice = state.totalPrice - isItemInCart.price * 1;
        state.adjustedTotalPrice =
          state.adjustedTotalPrice -
          calcAdjustedTotalPrice(isItemInCart.price, isItemInCart, 1);
      }
    },
    remove: (
      state,
      action: PayloadAction<RemoveCartItem & { quantity: number }>
    ) => {
      if (!state.cart) return;

      // check item in cart
      const isItemInCart = state.cart.items.find(
        (item) =>
          action.payload._id === item._id &&
          action.payload.selectedSize === item.selectedSize
      );

      if (!isItemInCart) return;

      state.cart = {
        ...state.cart,
        items: state.cart.items.filter((pItem) => {
          return !(
            pItem._id === action.payload._id &&
            pItem.selectedSize === action.payload.selectedSize
          );
        }),
        totalQuantities: state.cart.totalQuantities - isItemInCart.quantity,
      };
      state.totalPrice =
        state.totalPrice - isItemInCart.price * isItemInCart.quantity;
      state.adjustedTotalPrice =
        state.adjustedTotalPrice -
        calcAdjustedTotalPrice(
          isItemInCart.price,
          isItemInCart,
          isItemInCart.quantity
        );
    },
  },
});

export const { addToCart, removeCartItem, remove } = cartsSlice.actions;

export default cartsSlice.reducer;
