import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const Catalog: React.FC = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: "Camera", category: "Electronics", price: 50 },
    { id: 2, name: "Tent", category: "Outdoor", price: 30 },
    { id: 3, name: "Formal Suit", category: "Clothing", price: 70 },
  ]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}/day</p>
            <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;