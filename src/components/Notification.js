import React from 'react';
import "../css/websitecolors.css"

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification-container">
      <div className="notification">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Notification;
