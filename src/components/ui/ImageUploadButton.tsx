import { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import Button from './Button';

interface ImageUploadButtonProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  hasImage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ImageUploadButton = ({ 
  onFileSelect, 
  loading = false, 
  hasImage = false,
  className = '',
  size = 'md'
}: ImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <>
      <Button
        variant="secondary"
        size={size}
        onClick={handleButtonClick}
        loading={loading}
        className={`${sizeClasses[size]} ${className}`}
        disabled={loading}
      >
        {hasImage ? (
          <>
            <Camera size={iconSize[size]} />
            Cambiar foto
          </>
        ) : (
          <>
            <Upload size={iconSize[size]} />
            Añadir foto
          </>
        )}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default ImageUploadButton;