export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  _id: string; // MongoDB _id
  id?: string; // For backward compatibility
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
