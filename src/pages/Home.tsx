import React, { useState, useEffect } from 'react';
import { Search, ZoomIn } from 'lucide-react';
import ProtectedImage from '../components/ProtectedImage';

interface Image {
  id: string;
  url: string;
  title: string;
  photographer: string;
}

const Home: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // グローバルな右クリック防止
  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleGlobalContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
    };
  }, []);

  // キーボードショートカット防止
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && 
          ['s', 'c', 'u', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const images: Image[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      title: 'Mountain Lake',
      photographer: 'John Doe'
    },
    // ... 他の画像データ
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Photo Gallery</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search images..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <ProtectedImage
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                watermarkText={`© ${image.photographer}`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-white font-semibold">{image.title}</h3>
                <p className="text-gray-300 text-sm">by {image.photographer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <ProtectedImage
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
              watermarkText={`© ${selectedImage.photographer}`}
            />
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
              <p className="text-gray-300">Photographed by {selectedImage.photographer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;