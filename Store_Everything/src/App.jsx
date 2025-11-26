import { useState, useEffect } from 'react';
import { storage } from './lib/storage';
import { FolderNav } from './components/FolderNav';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { HardDrive, Search } from 'lucide-react';

function App() {
const [folders, setFolders] = useState([]);
const [files, setFiles] = useState([]);
const [currentFolderId, setCurrentFolderId] = useState(null);
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
const fetchFolders = () => {
setFolders(storage.getFolders());
};


const fetchFiles = () => {
  const allFiles = storage.getFiles();
  const filteredFiles = currentFolderId
    ? allFiles.filter((f) => f.folder_id === currentFolderId)
    : allFiles.filter((f) => f.folder_id === null);
  setFiles(filteredFiles);
};

fetchFolders();
fetchFiles();

}, [currentFolderId]);

const filteredFiles = files.filter((file) =>
file.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const currentFolder = folders.find((f) => f.id === currentFolderId);

return ( <div className="min-h-screen bg-gray-50 flex"> <div className="w-64 flex-shrink-0">
<FolderNav
folders={folders}
currentFolderId={currentFolderId}
onFolderChange={setCurrentFolderId}
onUpdate={() => {
setFolders(storage.getFolders());
const allFiles = storage.getFiles();
setFiles(currentFolderId ? allFiles.filter(f => f.folder_id === currentFolderId) : allFiles.filter(f => f.folder_id === null));
}}
/> </div>

```
  <div className="flex-1">
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FileStore</h1>
              <p className="text-sm text-gray-600">
                {currentFolder ? currentFolder.name : 'All Files'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>

    <main className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <FileUpload folderId={currentFolderId} userId="user-1" onUploadComplete={() => {
          const allFiles = storage.getFiles();
          setFiles(currentFolderId ? allFiles.filter(f => f.folder_id === currentFolderId) : allFiles.filter(f => f.folder_id === null));
        }} />

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {searchQuery ? `Search Results (${filteredFiles.length})` : 'Your Files'}
          </h2>
          <FileList files={filteredFiles} onDelete={() => {
            const allFiles = storage.getFiles();
            setFiles(currentFolderId ? allFiles.filter(f => f.folder_id === currentFolderId) : allFiles.filter(f => f.folder_id === null));
          }} />
        </div>
      </div>
    </main>
  </div>
</div>
);
}

export default App;
