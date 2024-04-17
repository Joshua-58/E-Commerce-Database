import React, { Component } from 'react';
import accimg from './img/assets/account-25.svg';
import ProductList from './components/ProductList';
import Notification from './components/Notification';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccountDropdownOpen: false,
      error: null,
      showNotification: false,
      notificationMessage: '',
    };
  }
  

  // Function to toggle the account dropdown
  toggleAccountDropdown = () => {
    this.setState({ isAccountDropdownOpen: !this.state.isAccountDropdownOpen });
  }

  handleLogout = () => {
    try {
      // Clear user session data
      localStorage.removeItem('token'); // Remove the user token
      localStorage.removeItem('userName'); // Remove user name

      // Update the state in the parent component to reflect the user is logged out
      this.props.setLoggedInUser(null);
      this.props.setIsLoggedIn(false);

      // Redirect the user to the login page or any other desired page
      window.location.href = '/marketzone_login';
    } catch (error) {
      this.setState({ error });
    }
  }

  handleAddToCartNotification = (productName) => {
    this.setState({
      showNotification: true,
      notificationMessage: `${productName} added to the cart!`,
    });

    setTimeout(() => {
      this.setState({
        showNotification: false,
        notificationMessage: '',
      });
    }, 1500);
  };

  render() {
    const { isLoggedIn, loggedInUser } = this.props;
    const { error, showNotification, notificationMessage } = this.state;

    return (
      <div>
        <header className="navbar">
          <a href='/'><h1 style={{color:"white"}}>Welcome to Marketzone</h1></a>
          <div className="account-dropdown">
            <button className="account-button" onClick={this.toggleAccountDropdown}>
              {isLoggedIn ? `My Account (${loggedInUser})` : 'My Account'}
              <img src={accimg} alt="acc" />
            </button>
            {this.state.isAccountDropdownOpen && (
              <div className="account-dropdown-content">
                <a href= "/marketzone_cart">View Cart</a> {/* Link to the cart page */}
                {isLoggedIn ? (
                  <a href="/account_details">Account Details</a>
                ) : (
                  <a href="/marketzone_login">Log In</a>
                )}
                {isLoggedIn && (
                  <a href="/" onClick={this.handleLogout}>
                    Log Out
                  </a>
                )}
                
              </div>
            )}
          </div>
        </header>

        <ProductList onAddToCartNotification={this.handleAddToCartNotification} />


        {showNotification && (
           <Notification
           message={notificationMessage}
           onClose={() => this.setState({ showNotification: false, notificationMessage: '' })}
         />
        )}

        {error && <div className="error">{error.message}</div>}
      </div>
    );
  }
}

export default App;
