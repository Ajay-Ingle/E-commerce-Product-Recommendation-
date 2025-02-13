import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductSelection from "./my-react-app/src/ProductSelection";

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
  const handlePurchase = (product) => {
    axios.post("http://127.0.0.1:5000/log_purchase", {
      user_id,
      purchased_item: product.name,
      category: product.category
    })
    .then(() => console.log("Purchase logged successfully"))
    .catch(error => console.error("Error logging purchase:", error));
  };

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
    </div>
  
);
}

function App(){
  return <ProductSelection/>
}
export default App;
