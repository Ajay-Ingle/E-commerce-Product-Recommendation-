import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ECommerce: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchProducts = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/products?page=${page}&limit=50`);
      setProducts(prevProducts => [...prevProducts, ...response.data.products]);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(1); // Initial fetch
  }, []);

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {products.map((product, index) => {
        if (products.length === index + 1) {
          return (
            <div ref={lastProductElementRef} key={index} className="card p-4 border rounded-lg shadow-md">
              <img
                src={product.images.large[0]}
                alt={product.title}
                className="w-full h-48 object-cover mb-4"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              />
              <h3 className="text-lg font-bold mb-2">{product.title}</h3>
              <p className="text-gray-700 mb-2">{product.store}</p>
              <p className="text-gray-700 mb-2">Rating: {product.average_rating} ({product.rating_number} reviews)</p>
              <p className="text-gray-700 mb-2">Price: {product.price}</p>
            </div>
          );
        } else {
          return (
            <div key={index} className="card p-4 border rounded-lg shadow-md">
              <img
                src={product.images.large[0]}
                alt={product.title}
                className="w-full h-48 object-cover mb-4"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              />
              <h3 className="text-lg font-bold mb-2">{product.title}</h3>
              <p className="text-gray-700 mb-2">{product.store}</p>
              <p className="text-gray-700 mb-2">Rating: {product.average_rating} ({product.rating_number} reviews)</p>
              <p className="text-gray-700 mb-2">Price: {product.price}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ECommerce;