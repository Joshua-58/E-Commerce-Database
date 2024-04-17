import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';  // Ensure the correct path
import { stripePromise } from './components/checkout';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from your database or API
    const fetchCartItems = async () => {
      try {
        const response = await fetch('https://marketzone-api.vercel.app/getCartItems');
        const data = await response.json();
        setCartItems(data);  // Assuming data is an array of cart items
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cartItems={cartItems} />
    </Elements>
  );
};

export default CheckoutPage;
