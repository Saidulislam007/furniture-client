export interface Product {
  _id: string;
  title: string;
  image: string;

  price: number;
  stock: number;

  description: string;

  status: "Published" | "Draft" | "Pending Approval";

  rating: number;

  deliveryFee: number;

  material?: string;
   subCategory?: string;
   oldPrice?: number;

  category?: string;   // ✅ Add this

  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };

  warranty?: string;

  colors?: {
    name: string;
    value: string;
  }[];
}