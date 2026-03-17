import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

function ImageUploader({ onFileSelect, currentAvatar, className = '' }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file) => {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    // Проверяем размер (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }
    
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
            <span>Перетащите фото сюда или</span>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleButtonClick}
            >
              Выбрать файл
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF до 5MB
          </p>
          
          {currentAvatar && !dragActive && (
            <div className="mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-600"
              >
                Удалить текущее фото
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ImageUploader.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  currentAvatar: PropTypes.string,
  className: PropTypes.string
};

export default ImageUploader;