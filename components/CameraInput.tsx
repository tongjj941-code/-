import React, { useRef, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraInputProps {
  onCapture: (dataUrl: string, timestamp: string) => void;
  label?: string;
  existingImage?: string | null;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onCapture, label = "点击拍照", existingImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const processImage = (file: File) => {
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to draw image + watermark
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Set proper resolution
        const maxWidth = 1200; // Resize for performance
        const scale = maxWidth / img.width;
        const width = Math.min(img.width, maxWidth);
        const height = img.height * scale;

        canvas.width = width;
        canvas.height = height;

        // Draw Image
        ctx.drawImage(img, 0, 0, width, height);

        // Add Watermark (Black bg with white text)
        const now = new Date();
        const timestamp = now.toLocaleString('zh-CN', { hour12: false });
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, height - 50, 340, 40);

        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🕒 ${timestamp}`, 20, height - 22);

        // Export
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl, timestamp);
        setProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment" // Prefer rear camera
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
      />
      
      {existingImage ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={existingImage} alt="Captured" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2"
            >
              <RefreshCw size={14} /> 重拍
            </button>
          </div>
          <div className="absolute bottom-1 right-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            已采样
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 active:scale-95 transition-all"
        >
          {processing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Camera className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-gray-500 font-black text-sm">{label}</span>
              <span className="text-[10px] text-gray-300 mt-1 font-medium">自动添加时间水印</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};