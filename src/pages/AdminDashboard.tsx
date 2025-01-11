import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

interface ImageItem {
  name: string;
  url: string;
  path: string;
}

const AdminDashboard: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const storage = getStorage();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const imagesRef = ref(storage, 'gallery');
      const result = await listAll(imagesRef);
      
      const imageList = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            url,
            path: item.fullPath
          };
        })
      );
      
      setImages(imageList);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('画像の読み込み中にエラーが発生しました');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // ファイル名を一意にするために現在のタイムスタンプを追加
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `gallery/${fileName}`);

      await uploadBytes(storageRef, file);
      setUploadProgress(100);
      await loadImages();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('アップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm('この画像を削除してもよろしいですか？')) return;

    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('画像の削除中にエラーが発生しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">画像管理ダッシュボード</h1>
        
        {/* アップロードセクション */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">画像のアップロード</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload className="mr-2" size={20} />
              画像を選択
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="flex-1 max-w-xs">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 画像一覧 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">アップロード済み画像一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.path} className="relative group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(image.path)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate">{image.name}</p>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <ImageIcon size={48} className="mb-4" />
                <p>アップロードされた画像はありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;