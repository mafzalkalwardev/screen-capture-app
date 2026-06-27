const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSources: () => ipcRenderer.invoke('get-sources'),
  captureScreen: (sourceId) => ipcRenderer.invoke('capture-screen', sourceId),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  processImage: (imagePath) => ipcRenderer.invoke('process-image', imagePath),
  exportCaptures: (format, captures, outputDir) => ipcRenderer.invoke('export-captures', format, captures, outputDir),
  onCaptureComplete: (callback) => ipcRenderer.on('capture-complete', callback),
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event)
});