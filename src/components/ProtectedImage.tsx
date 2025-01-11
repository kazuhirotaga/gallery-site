import React from 'react';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkText?: string;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  watermarkText = '© Photo Gallery'
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Ctrl+S, Ctrl+C, etc.
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="relative"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <img
        src={`${src}?w=800&q=80`} // 低解像度バージョンを使用
        alt={alt}
        className={className}
        draggable="false"
      />
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute bottom-0 right-0 p-2 text-white text-xs bg-black bg-opacity-50 rounded-tl">
          {watermarkText}
        </div>
      </div>
    </div>
  );
};

export default ProtectedImage;