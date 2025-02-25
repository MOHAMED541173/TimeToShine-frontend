import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '{}');
    setCart(savedCart);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/products`);
    const data = await response.json();
    setProducts(data);
  };

  const removeFromCart = (productId) => {
    const newCart = { ...cart };
    if (newCart[productId] > 1) {
      newCart[productId]--;
    } else {
      delete newCart[productId];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0).toFixed(2);
  };

  return (
    <div>
      <h2>Cart</h2>
      {Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return product ? (
          <div key={productId} className="cart-item">
            <span>{product.name} x {quantity}</span>
            <span>${(product.price * quantity).toFixed(2)}</span>
            <button onClick={() => removeFromCart(productId)}>Remove</button>
          </div>
        ) : null;
      })}
      <div>Total: ${getTotalPrice()}</div>
      <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;