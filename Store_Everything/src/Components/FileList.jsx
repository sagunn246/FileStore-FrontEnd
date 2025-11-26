import { useState } from 'react';
import { Download, Trash2, File as FileIcon, Image, Video, Music, FileText } from 'lucide-react';
import { storage } from '../lib/storage';

export function FileList({ files, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-8 w-8 text-green-500" />;
    if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (file) => {
    try {
      const a = document.createElement('a');
      a.href = file.file_data;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    setDeleting(file.id);
    try {
      storage.deleteFile(file.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <p className="text-lg">No files yet</p>
        <p className="text-sm">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-shrink-0">{getFileIcon(file.file_type)}</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(file)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(file)}
                disabled={deleting === file.id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <h3 className="font-medium text-gray-900 truncate mb-2" title={file.name}>
            {file.name}
          </h3>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{formatFileSize(file.file_size)}</p>
            <p>{formatDate(file.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
