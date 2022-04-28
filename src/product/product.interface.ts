export interface IProduct {
  id: number;
  brand: string;
  desc: string;
  detailDesc: string;
  colors: string;
  sizes: string;
  price: number;
  discount?: number | null;
}
