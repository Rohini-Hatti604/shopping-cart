import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../types';

const initialState: Product[] = [
  { id: '1', name: 'Bread', price: 1.10 },
  { id: '2', name: 'Milk', price: 0.50 },
  { id: '3', name: 'Cheese', price: 0.90 },
  { id: '4', name: 'Soup', price: 0.60 },
  { id: '5', name: 'Butter', price: 1.20 },
];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
