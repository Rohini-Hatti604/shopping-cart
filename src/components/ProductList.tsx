import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { basketActions } from '../store/basketSlice';
import './ProductList.css';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  const handleAddToBasket = (product: any) => {
    dispatch(basketActions.addToBasket(product));
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-vertical-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <span className="product-name">{product.name}</span>
            <span className="product-price">£{product.price.toFixed(2)}</span>
            <button 
              onClick={() => handleAddToBasket(product)}
              className="add-button"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
