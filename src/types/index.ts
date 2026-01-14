export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface BasketItem {
  product: Product;
  quantity: number;
  itemPrice: number;
  savings: number;
  itemCost: number;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  calculate: (items: BasketItem[]) => number;
}

export interface BillCalculation {
  subtotal: number;
  totalSavings: number;
  total: number;
  offers: {
    [key: string]: number;
  };
}

export type RootState = {
  products: Product[];
  basket: BasketItem[];
};
