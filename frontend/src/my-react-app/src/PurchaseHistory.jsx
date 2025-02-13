import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PurchaseHistory.css";

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const user_id = 1; // Example user ID

  // Fetch purchase history on component mount
  useEffect(() => {
    axios.post("http://127.0.0.1:5000/get_purchase_history", { user_id })
      .then(response => {
        setPurchaseHistory(response.data.purchase_history);
      })
      .catch(error => console.error("Error fetching purchase history:", error));
  }, []);

  return (
    <div className="purchase-history-container">
      <h1>Purchase History</h1>
      
      {purchaseHistory.length > 0 ? (
        <ul className="purchase-list">
          {purchaseHistory.map((item, index) => (
            <li key={index} className="purchase-item">
              {item.name} <span className="category">({item.category})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent purchases found.</p>
      )}

      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default PurchaseHistory;
