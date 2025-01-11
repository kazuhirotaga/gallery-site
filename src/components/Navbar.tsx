import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">フォトギャラリー</span>
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            アップロード
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;