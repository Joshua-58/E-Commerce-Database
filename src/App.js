import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './loginpage';
import RegistrationPage from './registration';
import HomePage from './homepage';
import Cookies from 'js-cookie';
import Accounts from './components/accounts';
import CartPage from './cartpage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './components/checkout'; // Make sure to replace with the correct path

// Make sure to replace 'your_stripe_publishable_key' with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51OAf3dEFbooIJPsjATP2hEpFnuy2Rcp4eQmlUkpbXLIGmADYjsZWMc9TmmnMw39Db005tBou8OVPOMsBIKMToyaj00wKZ5Ck7e');

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (you can use your cookie or token logic here)
    const userToken = localStorage.getItem('token');
    const userName = Cookies.get('userName');

    if (userToken && userName) {
      setLoggedInUser(userName);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/marketzone_login"
            element={<LoginPage setLoggedInUser={setLoggedInUser} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/marketzone_registration" element={<RegistrationPage />} />
          <Route path="/marketzone_cart" element={<CartPage />} />

          <Route
            path="/"
            element={<HomePage loggedInUser={loggedInUser} isLoggedIn={isLoggedIn} />}
          />

          <Route
            path="/account_details"
            element={<Accounts />}
          />

          <Route
            path="/marketzone_checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
