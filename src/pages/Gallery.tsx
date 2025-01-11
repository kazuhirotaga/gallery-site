import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ZoomIn } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  title: string;
  photographer: string;
}

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // サンプル画像データ
  const images: Image[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      title: '山の風景',
      photographer: '山田太郎'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1682687221038-404670f09439',
      title: '海の夕暮れ',
      photographer: '鈴木花子'
    }
  ];

  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.photographer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="画像を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Link
            key={image.id}
            to={`/image/${image.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9"
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-white font-semibold">{image.title}</h3>
              <p className="text-gray-300 text-sm">撮影: {image.photographer}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;