import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { basketActions } from '../store/basketSlice';
import './Basket.css';

const Basket: React.FC = () => {
  const { items, billCalculation } = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  const handleRemoveFromBasket = (productId: string) => {
    dispatch(basketActions.removeFromBasket(productId));
  };

  const handleClearBasket = () => {
    dispatch(basketActions.clearBasket());
  };

  const calculateItemSavings = (item: any): number => {
    let savings = 0;
    
   
    if (item.product.name === 'Cheese' && item.quantity >= 2) {
      const freeCheeses = Math.floor(item.quantity / 2);
      savings += freeCheeses * item.product.price;
    }
    
   
    if (item.product.name === 'Bread') {
      const soupItem = items.find(i => i.product.name === 'Soup');
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

  const calculateItemTotal = (item: any): number => {
    const itemPrice = item.product.price * item.quantity;
    const savings = calculateItemSavings(item);
    return itemPrice - savings;
  };

  if (items.length === 0) {
    return (
      <div className="basket">
        <h2>Basket</h2>
        <p className="empty-basket">Your basket is empty</p>
      </div>
    );
  }

  return (
    <div className="basket">
      <div className="basket-header">
        <h2>Basket</h2>
        <button onClick={handleClearBasket} className="clear-button">
          Clear Basket
        </button>
      </div>
      
      <div className="basket-items">
        {items.map((item) => (
          <div key={item.product.id} className="basket-item">
            <div className="item-info">
              <h4>{item.product.name}</h4>
              <p className="item-price">£{item.product.price.toFixed(2)}</p>
            </div>
            
            <div className="item-details">
              <div className="quantity-controls">
                <button 
                  onClick={() => handleRemoveFromBasket(item.product.id)}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => dispatch(basketActions.addToBasket(item.product))}
                  className="quantity-button"
                >
                  +
                </button>
              </div>
              
              <div className="item-calculations">
                <p className="item-subtotal">
                  Item price: £{item.product.price.toFixed(2)} × {item.quantity} = £{(item.product.price * item.quantity).toFixed(2)}
                </p>
                {calculateItemSavings(item) > 0 && (
                  <p className="item-savings">
                    Savings: £{calculateItemSavings(item).toFixed(2)}
                  </p>
                )}
                <p className="item-total">
                  Item cost: £{calculateItemTotal(item).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bill-summary">
        <h3>Bill Summary</h3>
        <div className="summary-row">
          <span>Sub Total:</span>
          <span>£{billCalculation.subtotal.toFixed(2)}</span>
        </div>
        
        {Object.keys(billCalculation.offers).length > 0 && (
          <div className="special-offers">
            <h4>Special Offers Applied:</h4>
            {Object.entries(billCalculation.offers).map(([name, savings]) => (
              <div key={name} className="offer-item">
                <span>{name}</span>
                <span className="offer-savings">-£{savings.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="summary-row savings">
          <span>Savings:</span>
          <span>£{billCalculation.totalSavings.toFixed(2)}</span>
        </div>
        
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>£{billCalculation.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Basket;
