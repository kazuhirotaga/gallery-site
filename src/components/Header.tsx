import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">RentalSystem</Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/catalog">Catalog</Link></li>
            {user ? (
              <>
                <li><Link to="/reservation"><ShoppingCart size={20} /></Link></li>
                <li><Link to="/profile"><User size={20} /></Link></li>
                <li>
                  <button onClick={logout} className="flex items-center">
                    <LogOut size={20} className="mr-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;