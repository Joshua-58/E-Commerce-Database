// Import necessary dependencies
import React, { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import '../css/checkoutForm.css';
import "../css/websitecolors.css"

// Replace 'pk_test_...' with your actual Stripe public key
const stripePromise = loadStripe('pk_test_51OAf3dEFbooIJPsjATP2hEpFnuy2Rcp4eQmlUkpbXLIGmADYjsZWMc9TmmnMw39Db005tBou8OVPOMsBIKMToyaj00wKZ5Ck7e');



// Define the CheckoutForm component
const CheckoutForm = () => {
  // Set up state for form fields and other necessary data
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Set up Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  const fetchTotalAmount = async () => {
    try {
      const response = await axios.get('https://marketzone-api.vercel.app/marketzone/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        // Calculate total amount based on the items in the cart
        const cartItems = response.data.data;
        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return totalAmount;
      } else {
        console.error('Failed to fetch cart items:', response.data.message);
        return 0; // Default to 0 if fetching fails
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return 0; // Default to 0 in case of an error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Validate form fields here if needed
  
      // Use Stripe to create a token
      const { token, error } = await stripe.createToken(elements.getElement(CardElement), {
        name: cardholderName,
      });
  
      if (token) {
        // Fetch the total amount dynamically
        const amount = await fetchTotalAmount();
  
        // Continue with the payment request to the server
        const response = await axios.post(
          'https://marketzone-api.vercel.app/marketzone/api/checkout',
          {
            shippingAddress,
            billingAddress: useShippingAsBilling ? shippingAddress : billingAddress,
            cardToken: token.id,
            amount,  // <-- Make sure 'amount' is defined in this scope
            name: cardholderName,
            email,
            phone,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        // Handle the response from the server
        console.log('Payment response:', response.data);
  
        if (response.data.success) {
          // Redirect to the order confirmation page
          const orderId = response.data.orderId;
          window.location.href = '/account_details'; // Assuming you are using React Router
        } else {
          // Handle payment failure
          console.error('Payment failed:', response.data.message);
          // Display an error message to the user
          // You may want to update your state to show an error message on the form
        }
      } else {
        // Handle token creation failure
        console.error('Error:', error);
        // Display an error message to the user
        // You may want to update your state to show an error message on the form
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle payment failure, e.g., show an error message to the user
      // You may want to update your state to show an error message on the form
    }
  };

  const handleGoBack = () => {
    window.location.href = '/marketzone_cart'; // Replace '/' with the URL of your homepage
  };
  

  // Implement a function to calculate the total amount based on the cart items
  const calculateTotalAmount = () => {
    // Replace this with your actual calculation logic based on the items in the cart
    return 100; // Placeholder value
  };

  

  return (
    <div>
    <header className='navbar' >
      <a href='/'><h1>Marketzone</h1></a>
      </header>
    <div className="forminfo">
      <h2 className="form-header">Checkout</h2>
      <form className="form-section"onSubmit={handleSubmit}>
        {/* Shipping Address Section */}
        <h3>Shipping Address</h3>
        <label>
          Street:
          <input className=''
            type="text"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            required
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            required
          />
        </label>
        <label>
          ZIP Code:
          <input
            type="text"
            value={shippingAddress.zip}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
            required
          />
        </label>

        {/* Billing Address Section */}
        <h3>Billing Address</h3>
        <label>
          Use shipping address as billing address:
          <input id="checkbox"
            type="checkbox"
            checked={useShippingAsBilling}
            onChange={() => setUseShippingAsBilling(!useShippingAsBilling)}
          />
          <br></br>
          <br></br>
        </label>
        {!useShippingAsBilling && (
          <>
            <label >
              Street:
              <input
                type="text"
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                required
              />
            </label>
            <label>
              ZIP Code:
              <input
                type="text"
                value={billingAddress.zip}
                onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
                required
              />
            </label>
          </>
        )}

        {/* Card Details Section */}
        <h3>Card Details</h3>
        <label>
          Cardholder's Name:
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </label>
        <label>
          Card Details:
          <CardElement className="CardElement" />
        </label>
        <button type="submit" >Submit Payment</button>
        <button onClick={handleGoBack} className="checkoutbutton">Back to Cart</button>
      </form>

    </div>
    </div>
  );
};

// Define the StripeCheckout component
const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

// Export the StripeCheckout component
export default StripeCheckout;
