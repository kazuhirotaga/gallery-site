import React from 'react';

const UserProfile: React.FC = () => {
  // In a real application, you would fetch the user's data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    reservations: [
      { id: 1, product: "Camera", startDate: "2024-03-15", endDate: "2024-03-20" },
      { id: 2, product: "Tent", startDate: "2024-04-01", endDate: "2024-04-05" },
    ],
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <h2 className="text-2xl font-bold mb-2">Your Reservations</h2>
      <ul>
        {user.reservations.map((reservation) => (
          <li key={reservation.id} className="mb-2">
            {reservation.product}: {reservation.startDate} to {reservation.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;