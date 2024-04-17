import React, { Component } from 'react';
import axios from 'axios';
import './css/cartpage.css';

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
    };
  }

  componentDidMount() {
    this.fetchCartData(); // Fetch cart data immediately when the component mounts
  
    // Set up an interval to fetch cart data every, for example, 5 minutes (300,000 milliseconds)
    this.cartDataInterval = setInterval(() => {
      this.fetchCartData();
    }, 800000);
  }
  
  componentWillUnmount() {
    // Clear the interval when the component is unmounted to avoid memory leaks
    clearInterval(this.cartDataInterval);
  }
  
  fetchCartData() {
    axios
      .get('https://marketzone-api.vercel.app/marketzone/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        //console.log('Cart data:', response.data.data); // Log the received data
        this.setState({ cartItems: response.data.data });
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }
  
  

  handleDeleteItem = (productId) => {
    axios
      .delete(`https://marketzone-api.vercel.app/marketzone/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          // Filter out the deleted item from the cartItems
          const updatedCartItems = this.state.cartItems.filter(item => item.product_id !== productId);
          this.setState({ cartItems: updatedCartItems });
        } else {
          console.error('Error deleting cart item:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting cart item:', error);
      });
  };
  
  handleCompletePurchase = () => {
    // Use the useHistory hook to navigate to the checkout page
    window.location.href = '/marketzone_checkout';
  };
  

  handleGoBack = () => {
    window.location.href = '/'; // Replace '/' with the URL of your homepage
  };
  
  
  
  

  calculateTotalPrice = () => {
    const { cartItems } = this.state;
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  render() {
    const { cartItems } = this.state;
  
    return (
      <div>
        <header className='navbar'>
          <a href='/'><h1>Marketzone</h1></a>
        </header>
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          {cartItems && cartItems.length > 0 ? (
            <div>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item.product_id} className="cart-item">
                    <div className="product-image">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    </div>
                    <div className="product-description">
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price} (Quantity: {item.quantity})</p>
                      <button
                        className="delete-button"
                        onClick={() => this.handleDeleteItem(item.product_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="total-price">
                <p>Total Price: ${this.calculateTotalPrice()}</p>
              </div>
              <button
                onClick={this.handleCompletePurchase}
                className="complete-purchase-button"
                disabled={cartItems.length === 0} // Disable the button if the cart is empty
              >Complete Purchase
              </button>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <button onClick={this.handleGoBack} className="go-back-button">
            Go Back to Homepage
          </button>
        </div>
      </div>
    );
  }
}  
  

export default CartPage;
