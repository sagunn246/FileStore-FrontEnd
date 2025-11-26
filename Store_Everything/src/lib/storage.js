const STORAGE_KEYS = {
FILES: 'filestore_files',
FOLDERS: 'filestore_folders',
};

export const storage = {
getFolders: () => {
const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
return data ? JSON.parse(data) : [];
},

saveFolders: (folders) => {
localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
},

getFiles: () => {
const data = localStorage.getItem(STORAGE_KEYS.FILES);
return data ? JSON.parse(data) : [];
},

saveFiles: (files) => {
localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
},

addFolder: (name) => {
const folders = storage.getFolders();
const newFolder = {
id: crypto.randomUUID(),
name,
parent_id: null,
created_at: new Date().toISOString(),
};
folders.push(newFolder);
storage.saveFolders(folders);
return newFolder;
},

deleteFolder: (id) => {
const folders = storage.getFolders().filter(f => f.id !== id);
storage.saveFolders(folders);

```
const files = storage.getFiles().filter(f => f.folder_id !== id);
storage.saveFiles(files);
```

},

addFile: (name, fileData, size, type, folderId) => {
const files = storage.getFiles();
const newFile = {
id: crypto.randomUUID(),
name,
file_data: fileData,
file_size: size,
file_type: type,
folder_id: folderId,
created_at: new Date().toISOString(),
};
files.push(newFile);
storage.saveFiles(files);
return newFile;
},

deleteFile: (id) => {
const files = storage.getFiles().filter(f => f.id !== id);
storage.saveFiles(files);
},
};
