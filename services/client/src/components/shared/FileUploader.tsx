import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload, accept = 'image/*,.pdf', multiple = false, maxSize = 10 * 1024 * 1024
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const fileArray = Array.from(selectedFiles).filter(f => f.size <= maxSize);
    setFiles(prev => multiple ? [...prev, ...fileArray] : fileArray);
    onUpload(fileArray);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver ? 'border-[#714B67] bg-purple-50 dark:bg-purple-950/20' : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400'
        }`}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-xs font-bold text-gray-600 dark:text-zinc-400">Drop files here or click to browse</p>
        <p className="text-[10px] text-gray-400 mt-1">Max size: {maxSize / 1024 / 1024}MB</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={(e) => handleFiles(e.target.files)} className="hidden" />
      </div>
      
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024).toFixed(1)}KB)</span>
              </div>
              <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};