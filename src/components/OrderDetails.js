import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/order.css'

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    axios.get('https://marketzone-api.vercel.app/marketzone/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setOrders(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleOrderClick = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null); // Close details if order already selected
    } else {
      setSelectedOrder(orderId);
    }
  };

  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className='bagel'>
      <h2 style={{paddingTop:"30px"}}>Your Orders</h2>
      {orders.map((order) => (
        <div key={order.order_id}>
          <p className="orderset"onClick={() => handleOrderClick(order.order_id)}>
            Order ID: {order.order_id}
          </p>
          {selectedOrder === order.order_id && ( // Show details only for the selected order
            <div className='ordersheet'>
              <p>Total Amount: {order.total_amount}</p>
              <p>Products List: {order.products_list}</p>
              <p>Shipping Address: {order.shipping_address}</p>
              <p>Billing Address: {order.billing_address}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;
