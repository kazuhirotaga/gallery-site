import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // In a real application, you would fetch the product details based on the ID
  const product = {
    id: Number(id),
    name: "Sample Product",
    description: "This is a sample product description.",
    price: 50,
    availability: true,
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="mb-4">{product.description}</p>
      <p className="mb-4">Price: ${product.price}/day</p>
      <p className="mb-4">Availability: {product.availability ? "In Stock" : "Out of Stock"}</p>
      <Link to="/reservation" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Make Reservation
      </Link>
    </div>
  );
};

export default ProductDetails;