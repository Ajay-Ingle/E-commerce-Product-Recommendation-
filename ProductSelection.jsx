import React, { useState } from "react";
import "./ProductSelection.css";

const products = [
  { id: 1, name: "Beauty & Personal Care" },
  { id: 2, name: "Health & Household" },
  { id: 3, name: "Video Games" },
  { id: 4, name: "Toys & Games" },
  { id: 5, name: "Sports & Outdoors" },
  { id: 6, name: "Electronics" },
  { id: 7, name: "Clothing & Fashion" },
  { id: 8, name: "Home & Kitchen" },
  { id: 9, name: "Tools & Home Improvement" },
  { id: 10, name: "Software" }
];

const ProductSelection = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelection = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.some((p) => p.id === product.id)
        ? prevSelected.filter((p) => p.id !== product.id) // Remove if selected
        : [...prevSelected, product] // Add if not selected
    );
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product category!");
      return;
    }

    const selectedNames = selectedProducts.map((p) => p.name);

    try {
      const response = await fetch("http://127.0.0.1:5000/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedProducts: selectedNames }),
      });

      if (response.ok) {
        alert("Preferences saved successfully!");
      } else {
        alert("Error saving preferences.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="product-container">
      <h1 className="title">Select Your Shopping Category</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className={`product-card ${
              selectedProducts.some((p) => p.id === product.id) ? "selected" : ""
            }`}
            onClick={() => handleSelection(product)}
            role="button"
            aria-label={Select ${product.name}}
            tabIndex={0}
          >
            <span className="plus-symbol">
              {selectedProducts.some((p) => p.id === product.id) ? "✔" : "+"}
            </span>
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div className="selected-choices">
          <h2>Selected Choices</h2>
          <div className="selected-list">
            {selectedProducts.map((product) => (
              <div key={product.id} className="selected-item">
                {product.name}
                <span
                  className="remove-btn"
                  onClick={() => handleSelection(product)}
                  role="button"
                  aria-label={Remove ${product.name}}
                  tabIndex={0}
                >
                  ✖
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Choices
      </button>
    </div>
  );
};

export default ProductSelection;