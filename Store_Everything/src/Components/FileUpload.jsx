import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { storage } from '../lib/storage';

export function FileUpload({ folderId, onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileData = e.target?.result;
        storage.addFile(file.name, fileData, file.size, file.type, folderId);

        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 1000);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload ${file.name}`);
    }
  };

const handleDrop = useCallback(
  async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploading(true);
    for (const file of files) {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      await uploadFile(file); 
    }
    setUploading(false);
    onUploadComplete();
  },
  [folderId, onUploadComplete, setIsDragging, setUploading, setUploadProgress, uploadFile]
);


  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    for (const file of files) {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      await uploadFile(file);
    }
    setUploading(false);
    onUploadComplete();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Support for any file type
        </p>
        <label className="inline-block">
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
            Select Files
          </span>
        </label>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div
              key={fileName}
              className="bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {fileName}
                </span>
                <span className="text-xs text-gray-500 ml-2">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
