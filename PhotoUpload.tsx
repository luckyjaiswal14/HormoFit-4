/**
 * HormoFit Photo Upload Component
 * Allows users to upload a photo to generate their digital twin.
 */

import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  onSkip: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, onSkip }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onUpload(fileInputRef.current!.files![0]);
        setIsUploading(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-rose-950 tracking-tight">Generate Your Twin</h2>
        <p className="text-rose-600/70 text-lg">Upload a photo to create a personalized virtual model of your hormonal health.</p>
      </div>

      <div className="relative group max-w-sm mx-auto">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-square rounded-[48px] border-4 border-dashed border-rose-200 bg-rose-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-rose-400 hover:bg-rose-50 overflow-hidden relative ${preview ? 'border-solid' : ''}`}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100 mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10" />
              </div>
              <p className="font-bold text-rose-900">Click to upload</p>
              <p className="text-sm text-rose-400">or drag and drop</p>
            </>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="font-bold tracking-widest uppercase text-xs">Generating Twin...</p>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button 
          onClick={handleUpload}
          disabled={!preview || isUploading}
          className={`w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl ${
            preview && !isUploading 
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200' 
              : 'bg-rose-100 text-rose-300 cursor-not-allowed shadow-none'
          }`}
        >
          <Upload className="w-6 h-6" />
          Generate Digital Twin
        </button>
        
        <button 
          onClick={onSkip}
          disabled={isUploading}
          className="w-full py-4 text-rose-400 font-bold hover:text-rose-600 transition-colors"
        >
          Skip for now
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-8 border-t border-rose-100">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Secure</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Private</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">AI-Powered</p>
        </div>
      </div>
    </div>
  );
};
