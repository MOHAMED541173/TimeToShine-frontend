import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '{}');
    setCart(savedCart);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.REACT_APP_HOST}api/products`);
    const data = await response.json();
    setProducts(data);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Order Data:', { cart, guestInfo, totalPrice: getTotalPrice() });

    for (const [productId, quantity] of Object.entries(cart)) {
      try {
        await fetch(`${process.env.REACT_APP_HOST}api/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (error) {
        console.error('Error during checkout:', error);
      }
    }
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        {Object.entries(cart).map(([productId, quantity]) => {
          const product = products.find(p => p.id === productId);
          return product ? (
            <div key={productId} className="checkout-item">
              <span>{product.name} x {quantity}</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ) : null;
        })}
        <div className="total">Total: ${getTotalPrice()}</div>
      </div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Guest Information</h3>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={guestInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={guestInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={guestInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={guestInfo.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={guestInfo.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={guestInfo.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <h3>Payment Information</h3>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={guestInfo.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardExpiry">Card Expiry (MM/YY)</label>
          <input
            type="text"
            id="cardExpiry"
            name="cardExpiry"
            value={guestInfo.cardExpiry}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardCVV">CVV</label>
          <input
            type="text"
            id="cardCVV"
            name="cardCVV"
            value={guestInfo.cardCVV}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="checkout-button">Complete Purchase</button>
      </form>
    </div>
  );
}

export default Checkout;