import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon, Trash2 } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import JSZip from 'jszip';

interface StoredImage {
  name: string;
  url: string;
  path: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_ZIP_TYPE = 'application/zip';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<StoredImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      
      setUploadedImages(imageList);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('画像の読み込み中にエラーが発生しました');
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError('ファイルサイズは10MB以下にしてください');
      return false;
    }

    if (file.type !== ALLOWED_ZIP_TYPE && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('PNG、JPG、GIF、またはZIPファイルのみアップロード可能です');
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const processZipFile = async (zipFile: File) => {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(zipFile);
      const imageFiles: { name: string; data: Blob }[] = [];

      // ZIPファイル内の画像ファイルを抽出
      for (const [filename, file] of Object.entries(contents.files)) {
        if (!file.dir && /\.(jpg|jpeg|png|gif)$/i.test(filename)) {
          const blob = await file.async('blob');
          if (blob.size <= MAX_FILE_SIZE) {
            imageFiles.push({ name: filename, data: blob });
          } else {
            console.warn(`Skipping ${filename}: File size exceeds limit`);
          }
        }
      }

      if (imageFiles.length === 0) {
        throw new Error('ZIPファイル内に有効な画像が見つかりませんでした');
      }

      // 進捗状況の計算用
      const total = imageFiles.length;
      let completed = 0;

      // 画像を順次アップロード
      for (const imageFile of imageFiles) {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${imageFile.name}`;
        const storageRef = ref(storage, `gallery/${fileName}`);
        
        await uploadBytes(storageRef, imageFile.data);
        completed++;
        setProgress((completed / total) * 100);
      }

      return imageFiles.length;
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      throw new Error('ZIPファイルの処理中にエラーが発生しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    try {
      setError(null);
      setUploading(true);
      setProgress(0);

      if (selectedFile.type === ALLOWED_ZIP_TYPE) {
        const uploadedCount = await processZipFile(selectedFile);
        alert(`${uploadedCount}枚の画像をアップロードしました`);
      } else {
        // 単一の画像ファイルの場合
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${selectedFile.name}`;
        const storageRef = ref(storage, `gallery/${fileName}`);
        await uploadBytes(storageRef, selectedFile);
        setProgress(100);
        alert('画像のアップロードが完了しました');
      }

      setSelectedFile(null);
      await loadImages();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'アップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm('この画像を削除してもよろしいですか？')) return;

    try {
      setError(null);
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('画像の削除中にエラーが発生しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">画像のアップロード</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        className="space-y-6"
      >
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,application/zip"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">
            ドラッグ＆ドロップ、またはクリックして画像を選択
          </p>
          <p className="text-sm text-gray-500">
            PNG、JPG、GIF、または ZIP ファイル（最大10MB）
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              選択されたファイル: {selectedFile.name}
            </p>
          </div>
        )}

        {uploading && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              アップロード中... {Math.round(progress)}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </form>

      {/* アップロード済み画像一覧 */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">アップロード済み画像</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedImages.map((image) => (
            <div key={image.path} className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(image.path)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="削除"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 truncate">{image.name}</p>
            </div>
          ))}
          {uploadedImages.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              アップロードされた画像はありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;