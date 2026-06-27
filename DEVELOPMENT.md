# Development Guide - Screen Capture App

## Architecture Overview

### System Design

```
┌─────────────────────────────────────┐
│   React Frontend (UI Layer)         │
│  - Components                       │
│  - State Management                 │
│  - User Interactions                │
└────────────┬────────────────────────┘
             │ IPC Communication
             ▼
┌─────────────────────────────────────┐
│   Preload Script (Security Layer)   │
│  - Context Bridge                   │
│  - API Exposure                     │
└────────────┬────────────────────────┘
             │ Electron API
             ▼
┌─────────────────────────────────────┐
│   Electron Main (Desktop Layer)     │
│  - Screen Capture                   │
│  - File System Access               │
│  - Native Dialogs                   │
└────────────┬────────────────────────┘
             │
   ┌─────────┴─────────┬────────────┬──────────────┐
   ▼                   ▼            ▼              ▼
┌────────────┐  ┌────────────┐ ┌─────────┐ ┌──────────────┐
│   OCR      │  │   Export   │ │ Image   │ │   Audio      │
│  Engine    │  │  Engine    │ │Process  │ │  Processor   │
└────────────┘  └────────────┘ └─────────┘ └──────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Desktop | Electron | ^25.0.0 |
| Frontend | React | ^18.2.0 |
| Styling | Tailwind CSS | ^3.3.3 |
| Animations | Framer Motion | ^10.12.16 |
| OCR | Tesseract.js | ^4.1.4 |
| Image | Sharp | ^0.32.6 |
| PDF Export | PDFKit | ^0.13.0 |
| DOCX Export | docx | ^8.2.4 |
| Build | Electron Builder | ^24.6.3 |

---

## Module Architecture

### Backend Modules (lib/)

#### 1. **ocr.js** - OCR Processing
```javascript
const OCRProcessor = require('./lib/ocr');

const processor = new OCRProcessor();
await processor.initialize();
const content = await processor.processImage(imagePath);
// Returns: { text, headings, paragraphs, mcqs, lists }
```

**Methods:**
- `initialize()` - Start Tesseract worker
- `processImage(path)` - Extract text from image
- `parseContent(text)` - Structure extracted text
- `terminate()` - Clean up resources

#### 2. **export.js** - Export Engine
```javascript
const ExportManager = require('./lib/export');

const exporter = new ExportManager(outputDir);
const filePath = await exporter.export(format, captures, fileName);
// Supported formats: pdf, docx, json, txt, md
```

**Methods:**
- `exportToPDF()` - Generate PDF
- `exportToDOCX()` - Generate Word document
- `exportToJSON()` - Generate JSON
- `exportToTXT()` - Generate text file
- `exportToMarkdown()` - Generate Markdown

#### 3. **imageProcessor.js** - Image Processing
```javascript
const ImageProcessor = require('./lib/imageProcessor');

const processor = new ImageProcessor();
const result = await processor.processImages(imagePath, outputDir);
// Returns: { original, thumbnail, optimized, metadata }
```

**Methods:**
- `processImages()` - Optimize images
- `detectImageRegions()` - Find image areas
- `cropRegions()` - Extract specific regions

#### 4. **audioProcessor.js** - Audio Handling
```javascript
const AudioProcessor = require('./lib/audioProcessor');

const processor = new AudioProcessor(outputDir);
const recordingId = await processor.startRecording();
const audioPath = await processor.stopRecording(recordingId);
const transcript = await processor.transcribeAudio(audioPath);
```

**Methods:**
- `startRecording()` - Begin audio capture
- `stopRecording()` - End audio capture
- `transcribeAudio()` - Convert speech to text
- `saveTranscript()` - Save transcription

#### 5. **contentOrganizer.js** - Content Structuring
```javascript
const ContentOrganizer = require('./lib/contentOrganizer');

const organized = ContentOrganizer.organize(ocrContent, images, audio);
// Returns: { sections, metadata }
```

**Methods:**
- `organize()` - Structure all content
- `createSections()` - Create logical sections
- `deduplicateContent()` - Remove duplicates
- `generateSummary()` - Create summary

#### 6. **logger.js** - Application Logging
```javascript
const logger = require('./lib/logger');

logger.info('Message', { data: 'value' });
logger.warn('Warning', { warning: 'data' });
logger.error('Error', error, { context: 'data' });
logger.debug('Debug info', { debug: 'data' });
```

**Methods:**
- `info()` - Log informational messages
- `warn()` - Log warnings
- `error()` - Log errors with stack traces
- `debug()` - Log debug info (if DEBUG=true)
- `clearOldLogs()` - Clean old logs

#### 7. **config.js** - Configuration Manager
```javascript
const config = require('./lib/config');

const value = config.get('ocr.language');
config.set('app.title', 'New Title');
const all = config.getAll();
```

**Methods:**
- `get()` - Retrieve config value
- `set()` - Set config value
- `getAll()` - Get full configuration
- `printConfig()` - Display config (debug)

---

## React Component Structure

### Component Hierarchy

```
App
├── CaptureButton
│   └── Framer Motion (animations)
├── Preview
│   ├── Screenshot display
│   ├── Text preview
│   ├── MCQ display
│   └── Headings list
├── ProgressIndicator
│   └── Loading spinner
└── ExportSection
    ├── Format selector
    ├── Directory selector
    └── Export button
```

### Component API

**CaptureButton.js**
```javascript
<CaptureButton 
  onClick={handleCapture}
  disabled={!selectedSource}
/>
```

**Preview.js**
```javascript
<Preview 
  content={processedContent}
  imagePath={capturedImagePath}
/>
```

**ProgressIndicator.js**
```javascript
<ProgressIndicator message="Processing..." />
```

**ExportSection.js**
```javascript
<ExportSection captures={allCaptures} />
```

---

## IPC Communication

### Main Process → Renderer Process

**main.js - IPC Handlers**

```javascript
// Screen capture
ipcMain.handle('get-sources', async () => { ... })
ipcMain.handle('capture-screen', async (event, sourceId) => { ... })

// OCR processing
ipcMain.handle('process-image', async (event, imagePath) => { ... })

// Export
ipcMain.handle('export-captures', async (event, format, captures, outputDir) => { ... })

// File system
ipcMain.handle('select-directory', async () => { ... })
```

### Renderer Process → Main Process

**preload.js - Exposed APIs**

```javascript
window.electronAPI.getSources()           // Get available screens
window.electronAPI.captureScreen(sourceId) // Capture screenshot
window.electronAPI.processImage(path)      // Run OCR
window.electronAPI.exportCaptures(...)     // Export captures
window.electronAPI.selectDirectory()       // Choose output folder
```

---

## Data Flow

### Capture Workflow

```
1. Select Source
   └─> Render source thumbnails

2. Capture Screen
   └─> electronAPI.captureScreen()
   └─> main.js: desktopCapturer
   └─> Save PNG to temp
   └─> Return file path

3. Process Image
   └─> electronAPI.processImage()
   └─> main.js: OCRProcessor
   └─> Tesseract OCR extraction
   └─> ContentOrganizer structuring
   └─> Return { text, headings, mcqs, ... }

4. Preview Content
   └─> Display in Preview component
   └─> Show extracted text
   └─> Show detected MCQs
   └─> Show structure

5. Export
   └─> electronAPI.exportCaptures()
   └─> main.js: ExportManager
   └─> Format conversion
   └─> File output
   └─> Return file path
```

---

## State Management

### React State (App.js)

```javascript
const [sources, setSources]           = useState([])        // Available screens
const [selectedSource, setSelectedSource] = useState(null)  // Selected screen
const [capturedImage, setCapturedImage] = useState(null)    // Image path
const [processedContent, setProcessedContent] = useState(null) // OCR result
const [captures, setCaptures] = useState([])                // All captures
const [currentStep, setCurrentStep] = useState('select')    // UI step
```

### State Flow

```
select → capture → process → preview → select/finish
  ↓        ↓         ↓        ↓
  setSources
           setCapturedImage
                    setProcessedContent
                              setCaptures
```

---

## Error Handling

### Try-Catch Patterns

```javascript
try {
  const result = await window.electronAPI.method();
} catch (error) {
  logger.error('Operation failed', error, { 
    operation: 'method',
    timestamp: new Date()
  });
  alert('Operation failed: ' + error.message);
}
```

### Error Boundaries

Add error boundary component for React errors:

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('React error', error, errorInfo);
  }
}
```

---

## Performance Optimization

### Code Splitting

```javascript
const Preview = React.lazy(() => import('./components/Preview'));

<Suspense fallback={<ProgressIndicator message="Loading..." />}>
  <Preview {...props} />
</Suspense>
```

### Memoization

```javascript
const CaptureButton = React.memo(({ onClick, disabled }) => {
  return <button onClick={onClick} disabled={disabled}>Capture</button>;
});
```

### Debouncing

```javascript
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
```

---

## Testing

### Unit Testing Setup

Create `src/__tests__/App.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders capture button', () => {
  render(<App />);
  expect(screen.getByText(/Start Capture/i)).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

### Integration Testing

Test IPC communication:
```javascript
test('IPC capture works', async () => {
  const result = await window.electronAPI.captureScreen(sourceId);
  expect(result).toBeTruthy();
});
```

---

## Building & Packaging

### Electron Builder Config

In `package.json`:

```json
{
  "build": {
    "appId": "com.screencapture.app",
    "productName": "Screen Capture App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "main.js",
      "preload.js",
      "node_modules/**/*"
    ]
  }
}
```

### Build Commands

```bash
npm run build         # Build React app
npm run dist          # Create executable
npm run package       # Custom build options
```

---

## Debugging

### Chrome DevTools

Press `Ctrl+Shift+I` in running app to open DevTools.

### Main Process Debugging

```bash
node --inspect ./node_modules/electron/dist/electron.js .
```

Connect Chrome to `chrome://inspect`.

### Log Files

Check `./logs/app-YYYY-MM-DD.log` for application logs.

Enable debug mode:
```bash
DEBUG=true npm run dev
```

---

## Adding Features

### Example: Add New Export Format

1. **Add to export.js:**
```javascript
async exportToYAML(captures, fileName = 'output.yaml') {
  // Implementation
  const filePath = path.join(this.outputDir, fileName);
  // Process and write
  return filePath;
}

async export(format, captures, fileName) {
  case 'yaml':
    return await this.exportToYAML(captures, fileName);
}
```

2. **Update main.js IPC:**
```javascript
ipcMain.handle('export-captures', async (event, format, captures, outputDir) => {
  // Already supports yaml in export()
});
```

3. **Update UI component:**
```javascript
<select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
  {/* ... existing ... */}
  <option value="yaml">YAML</option>
</select>
```

---

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

## Code Style Guide

- Use ES6+ syntax
- Follow Airbnb style guide
- Use meaningful variable names
- Comment complex logic
- Keep functions focused and small
- Use async/await over promises
- Validate inputs
- Handle errors gracefully

---

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes following code style
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

---

## Version History

- **1.0.0** - Initial release
  - Screen capture
  - OCR processing
  - Multi-format export
  - Cross-platform support