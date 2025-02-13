import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductSelection from "./ProductSelection";
import PurchaseHistory from "./PurchaseHistory";

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user_id = 1;  // Example user ID

  // Fetch recommendations on load
  useEffect(() => {
    axios.post("http://127.0.0.1:5000/recommend", { user_id })
      .then(response => {
        setProducts(response.data.recommended);
      })
      .catch(error => console.error("Error fetching recommendations:", error));
  }, []);

  // Handle search submission
  const handleSearch = () => {
    axios.post("http://127.0.0.1:5000/log_search", { user_id, search_query: searchQuery })
      .then(() => {
        console.log("Search logged successfully");
        setSearchQuery("");
      })
      .catch(error => console.error("Error logging search:", error));
  };

  // Handle purchase action
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  

  // Fetch purchase history from backend
  useEffect(() => {
    if (showHistory) {
      axios
        .get(`http://127.0.0.1:5000/get_purchase_history?user_id=${user_id}`)
        .then((response) => {
          setPurchaseHistory(response.data.purchases || []);
        })
        .catch((error) => console.error("Error fetching purchase history:", error));
    }
  }, [showHistory]); // Fetch data only when showHistory is true
  

  return (
    
    <div>
     
      <h2>Recommended Products</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for products..."
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {products.map((product, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "10px" }}>
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <button onClick={() => handlePurchase(product)}>Buy</button>
          </div>
        ))}
      </div>
  
       {/* Integrate ProductSelection Component */}
       <ProductSelection />
       <div>
      <h1>Welcome to E-commerce</h1>
      <button onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? "Hide Purchase History" : "Show Purchase History"}
      </button>

      {showHistory && (
        <div className="purchase-history">
          <h2>Purchase History</h2>
          {purchaseHistory.length > 0 ? (
            <ul>
              {purchaseHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No purchases found.</p>
          )}
        </div>
      )}
    </div>
      
      
    </div>
    

    
  );
  
}


  

export default App;
