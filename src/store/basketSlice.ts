import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BasketItem, Product, BillCalculation } from '../types';

interface BasketState {
  items: BasketItem[];
  billCalculation: BillCalculation;
}

const initialState: BasketState = {
  items: [],
  billCalculation: {
    subtotal: 0,
    totalSavings: 0,
    total: 0,
    offers: {},
  },
};

const calculateItemSavings = (item: BasketItem, allItems: BasketItem[]): number => {
  let savings = 0;
  

  if (item.product.name === 'Cheese' && item.quantity >= 2) {
    const freeCheeses = Math.floor(item.quantity / 2);
    savings += freeCheeses * item.product.price;
  }
  

  if (item.product.name === 'Bread') {
    const soupItem = allItems.find(i => i.product.name === 'Soup');
    if (soupItem) {
      const discountedBreads = Math.min(soupItem.quantity, item.quantity);
      savings += discountedBreads * (item.product.price * 0.5);
    }
  }
  

  if (item.product.name === 'Butter') {
    savings += item.quantity * (item.product.price * (1/3));
  }
  
  return savings;
};

const updateItemsWithSavings = (items: BasketItem[]): BasketItem[] => {
  return items.map(item => {
    const itemPrice = item.product.price * item.quantity;
    const savings = calculateItemSavings(item, items);
    return {
      ...item,
      itemPrice,
      savings,
      itemCost: itemPrice - savings
    };
  });
};

const calculateSpecialOffers = (items: BasketItem[]): { [key: string]: number } => {
  const offers: { [key: string]: number } = {};

 
  const cheeseItem = items.find(item => item.product.name === 'Cheese');
  if (cheeseItem && cheeseItem.quantity >= 2) {
    const freeCheeses = Math.floor(cheeseItem.quantity / 2);
    const savings = freeCheeses * cheeseItem.product.price;
    offers['Cheese BOGO'] = savings;
  }

  
  const soupItem = items.find(item => item.product.name === 'Soup');
  const breadItem = items.find(item => item.product.name === 'Bread');
  if (soupItem && breadItem) {
    const discountedBreads = Math.min(soupItem.quantity, breadItem.quantity);
    const savings = discountedBreads * (breadItem.product.price * 0.5);
    offers['Soup + Bread Combo'] = savings;
  }

 
  const butterItem = items.find(item => item.product.name === 'Butter');
  if (butterItem) {
    const savings = butterItem.quantity * (butterItem.product.price * (1/3));
    offers['Butter Discount'] = savings;
  }

  return offers;
};

const calculateBill = (items: BasketItem[]): BillCalculation => {
  const updatedItems = updateItemsWithSavings(items);
  const subtotal = updatedItems.reduce((sum: number, item) => sum + item.itemPrice, 0);
  const specialOffers = calculateSpecialOffers(items);
  const totalSavings = Object.values(specialOffers).reduce((sum: number, savings: number) => sum + savings, 0);
  const total = subtotal - totalSavings;

  return {
    subtotal,
    totalSavings,
    total,
    offers: specialOffers,
  };
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          product: action.payload, 
          quantity: 1,
          itemPrice: 0,
          savings: 0,
          itemCost: 0
        });
      }
      state.items = updateItemsWithSavings(state.items);
      state.billCalculation = calculateBill(state.items);
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.product.id !== action.payload);
        }
      }
      state.items = updateItemsWithSavings(state.items);
      state.billCalculation = calculateBill(state.items);
    },
    clearBasket: (state) => {
      state.items = [];
      state.billCalculation = calculateBill([]);
    },
  },
});

export const basketActions = basketSlice.actions;
export default basketSlice.reducer;
