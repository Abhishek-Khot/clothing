export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: string; // MongoDB _id is a string
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  description: string;
  category: string;
  sizes: string[];
};
