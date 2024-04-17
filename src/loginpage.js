import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./css/websitecolors.css"

function LoginPage(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const response = await axios.post('https://marketzone-api.vercel.app/marketzone/api/login', {
        username,
        password,
      });

      console.log('Login Response:', response);

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        alert('Login successful!');

        // Set a cookie to remember the login status
        Cookies.set('isLoggedIn', 'true', { expires: 7 });
        

        // Fetch the user's name using an API call
        const userDataResponse = await axios.get('https://marketzone-api.vercel.app/marketzone/api/userData', { headers });

        if (userDataResponse.data.success) {
          // Modify this part to match your actual API response structure
          const userName = userDataResponse.data.data.username;
          // Store the user's name in a cookie
          console.log(userName);
          console.log("Test");
          Cookies.set('userName', userName, { expires: 7 });
          props.setLoggedInUser(userName);
          props.setIsLoggedIn(true);
          navigate('/');
        }

        
      } else {
        alert('Login failed. Please check your credentials.');
      }

      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div>
      <div className="header">
        <h2 style={{ marginBottom: "30px" }}>Website</h2>
      </div>
      <div className="loginsection">
        <h2>
          Hello, Sign in or <Link to="/marketzone_registration">create an account</Link>
        </h2>
        <form action="" method="post" onSubmit={handleFormSubmit}>
          <div className="forminfo">
            <label htmlFor="username" className="floating-label floating_label--animate floating_label--inline">Username</label>
            <div className="floating-label">
              <input type="text" id="username" maxLength="64" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="forminfo" style={{ marginBottom: '40px' }}>
            <label htmlFor="password" className="floating-label floating_label--animate floating_label--inline">Password</label>
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button  type="submit" className="loginbutton" >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
