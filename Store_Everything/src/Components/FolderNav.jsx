import { useState } from 'react';
import { Folder, FolderPlus, Trash2 } from 'lucide-react';
import { storage } from '../lib/storage';

export function FolderNav({ folders, currentFolderId, onFolderChange, onUpdate }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    storage.addFolder(newFolderName);
    setNewFolderName('');
    setIsCreating(false);
    onUpdate();
  };

  const handleDeleteFolder = (folderId, folderName) => {
    if (!confirm(`Delete folder "${folderName}" and all its contents?`)) return;

    storage.deleteFolder(folderId);
    if (currentFolderId === folderId) {
      onFolderChange(null);
    }
    onUpdate();
  };

  return (
    <div className="bg-white border-r border-gray-200 p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Folders</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="New Folder"
        >
          <FolderPlus className="h-5 w-5" />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateFolder} className="mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewFolderName('');
              }}
              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        <button
          onClick={() => onFolderChange(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            currentFolderId === null
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Folder className="h-5 w-5" />
          <span className="flex-1 text-left font-medium">All Files</span>
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center gap-2 rounded-lg transition-colors ${
              currentFolderId === folder.id ? 'bg-blue-50' : 'hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => onFolderChange(folder.id)}
              className={`flex-1 flex items-center gap-2 px-3 py-2 ${
                currentFolderId === folder.id ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              <Folder className="h-5 w-5" />
              <span className="flex-1 text-left truncate">{folder.name}</span>
            </button>
            <button
              onClick={() => handleDeleteFolder(folder.id, folder.name)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete folder"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
