import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Heart, Share2 } from 'lucide-react';

const ImageView = () => {
  const { id } = useParams<{ id: string }>();

  // サンプルデータ（実際のアプリケーションではデータベースから取得）
  const image = {
    id,
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    title: '山の風景',
    photographer: '山田太郎',
    date: '2024-03-15',
    likes: 128,
    downloads: 45
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        ギャラリーに戻る
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-[600px] object-cover"
        />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{image.title}</h1>
              <p className="text-gray-600">撮影: {image.photographer}</p>
              <p className="text-gray-500 text-sm">{image.date}</p>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <Heart className="h-5 w-5 mr-1" />
                {image.likes}
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <Download className="h-5 w-5 mr-1" />
                {image.downloads}
              </button>
              <button className="flex items-center text-gray-600 hover:text-green-500">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;