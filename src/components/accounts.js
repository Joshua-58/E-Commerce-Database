import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetails from './OrderDetails'; // Import the new component
import  '../css/account.css'

function Accounts() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);


  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuthentication = () => {
      const token = localStorage.getItem('token'); // Get the token from local storage
      if (token) {
        // Fetch user account details from the backend
        axios.get('https://marketzone-api.vercel.app/marketzone/api/accountDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            const userData = response.data.data;
            setUser(userData);
          })
          .catch((error) => {
            console.error('Error fetching user account details:', error);
          });
      }
    };

    checkAuthentication(); // Call the checkAuthentication function when the component loads
  }, []);

  const handleResetPassword = () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      // Implement password reset logic
      axios.post('https://marketzone-api.vercel.app/marketzone/api/resetPassword', { newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      })
        .then((response) => {
          if (response.data.success) {
            alert('Password reset successful');
          } else {
            alert('Password reset failed');
          }
        })
        .catch((error) => {
          console.error('Error resetting password:', error);
        });
    }
  };

  const handleProductSubmit = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const productData = {
        image: productImage,
        name: productName,
        description: productDescription,
        price: productPrice,
        quantity: productQuantity, 
      };
  
      axios.post('https://marketzone-api.vercel.app/marketzone/api/listProducts', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            alert('Product listed successfully');
          } else {
            alert('Product listing failed');
          }
        })
        .catch((error) => {
          console.error('Error listing product:', error);
        });
    }
  };
  
  const [productQuantity, setProductQuantity] = useState(1);

  return (
    
    <div>
      <header className='navbar' >
      <a href='/'><h1>Marketzone</h1></a>
      </header>
      <div className='info-container'>
      <div className='contentwithin'>
      <h1>Account Details</h1>
      <div>
        <p>Full Name: {user.first_name} {user.last_name}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
      
      <h2>List a Product</h2>
      <div className='product-form'>
        
      <input
  className='forminputs'
  type="text"
  placeholder="Image Link"
  value={productImage}
  onChange={(e) => setProductImage(e.target.value)}
/>

        <input
        className='forminputs'
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
        className='forminputs'
          type="text"
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input
        className='forminputs'
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
        className='forminputs'
          type="number"
          placeholder="Product Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        
        <button onClick={handleProductSubmit}>List Product</button>
      </div>

      {/* New component to display order details */}
      <OrderDetails />
      </div>
      </div>
    </div>
  );
}

export default Accounts;
