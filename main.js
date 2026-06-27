const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const OCRProcessor = require('./lib/ocr');
const ExportManager = require('./lib/export');

let mainWindow;
let ocrProcessor;
let exportManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png') // Add icon later
  });

  // Load the React app
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'build/index.html')}`
  );

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();
  ocrProcessor = new OCRProcessor();
  try {
    await ocrProcessor.initialize();
  } catch (error) {
    console.error('OCR initialization failed:', error);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  if (ocrProcessor) {
    await ocrProcessor.terminate();
  }
});

// IPC handlers for screen capture
ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 150, height: 150 }
  });
  return sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL()
  }));
});

ipcMain.handle('capture-screen', async (event, sourceId) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    const source = sources.find(s => s.id === sourceId);
    if (!source) throw new Error('Source not found');

    const image = source.thumbnail;
    const buffer = image.toPNG();

    // Save to temp file
    const tempDir = path.join(app.getPath('temp'), 'screen-capture');
    await fs.mkdir(tempDir, { recursive: true });
    const filePath = path.join(tempDir, `capture-${Date.now()}.png`);
    await fs.writeFile(filePath, buffer);

    return filePath;
  } catch (error) {
    throw new Error(`Capture failed: ${error.message}`);
  }
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('process-image', async (event, imagePath) => {
  if (!ocrProcessor || !ocrProcessor.worker) {
    throw new Error('OCR engine is not initialized. Please restart the app or try again later.');
  }

  try {
    const content = await ocrProcessor.processImage(imagePath);
    return content;
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
});

ipcMain.handle('export-captures', async (event, format, captures, outputDir) => {
  try {
    exportManager = new ExportManager(outputDir);
    const fileName = `output.${format}`;
    const filePath = await exportManager.export(format, captures, fileName);
    return filePath;
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
});