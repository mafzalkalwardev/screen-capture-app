# Setup Guide - Screen Capture App

## Prerequisites

- Node.js v16+ (https://nodejs.org/)
- npm v8+ (comes with Node.js)
- Git (optional, for version control)

### For Different Platforms

**Windows:**
- Visual Studio Build Tools or mingw-w64 (for native modules compilation)

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`

**Linux:**
- Build essentials: `sudo apt-get install build-essential python3`
- Additional libraries: `sudo apt-get install libx11-dev libxkbfile-dev`

---

## Installation Steps

### 1. Clone or Download Repository

```bash
# Clone from git (if available)
git clone <repository-url>
cd ScreenCaptureApp

# OR extract downloaded zip file
cd ScreenCaptureApp
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Electron (desktop framework)
- React (UI framework)
- Tesseract.js (OCR engine)
- PDFKit, docx (export libraries)
- Tailwind CSS (styling)
- Framer Motion (animations)

### 3. Environment Configuration

Copy the example environment file and customize if needed:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` to customize settings (optional):
```
NODE_ENV=development
DEBUG=false
OCR_LANGUAGE=eng
EXPORT_DEFAULT_FORMAT=pdf
```

---

## Running the Application

### Development Mode

Starts React dev server and Electron together with hot reload:

```bash
npm run dev
```

This will:
1. Start React development server on http://localhost:3000
2. Launch Electron app connected to dev server
3. Open DevTools for debugging

### Production Build

Create optimized build:

```bash
# Build React app
npm run build

# Create executable
npm run dist
```

Output files will be in `dist/` directory

---

## Building for Distribution

### Windows Installer

```bash
npm run dist
```

Creates: `dist/Screen Capture App Setup 1.0.0.exe`

### macOS Application

```bash
npm run dist
```

Creates: `dist/Screen Capture App-1.0.0.dmg`

### Linux AppImage

```bash
npm run dist
```

Creates: `dist/screen-capture-app-1.0.0.AppImage`

---

## Project Structure

```
ScreenCaptureApp/
├── main.js                 # Electron main process
├── preload.js             # IPC security bridge
├── package.json           # Dependencies
├── lib/                   # Backend modules
│   ├── ocr.js            # OCR processing
│   ├── export.js         # Export engine
│   ├── imageProcessor.js # Image processing
│   ├── audioProcessor.js # Audio handling
│   ├── contentOrganizer.js # Content structure
│   ├── logger.js         # Logging utility
│   └── config.js         # Configuration manager
├── src/                   # React components
│   ├── App.js            # Main component
│   ├── index.js          # React entry
│   ├── components/       # React components
│   │   ├── CaptureButton.js
│   │   ├── Preview.js
│   │   ├── ProgressIndicator.js
│   │   └── ExportSection.js
│   └── App.css           # Styles
├── public/               # Static files
│   └── index.html       # HTML template
├── build/               # Production build output
├── dist/                # Packaged executables
└── logs/                # Application logs
```

---

## Usage Workflow

1. **Launch Application**
   ```bash
   npm run dev    # Development
   # or open dist/executable  # Production
   ```

2. **Select Source**
   - Choose screen/window from list
   - Review thumbnail preview

3. **Capture**
   - Click "Start Capture"
   - Wait for processing
   - Review extracted content

4. **Navigate**
   - Click "Next" for more captures
   - Click "Finish" when done

5. **Export**
   - Select format (PDF/DOCX/TXT/JSON/MD)
   - Choose output directory
   - Click "Export"

---

## Troubleshooting

### npm install fails with permission errors

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### react-scripts not found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Electron not launching

```bash
# Check Node version
node --version  # Should be v16+

# Run with debug
npm run dev 2>&1 | tee debug.log
```

### OCR not working

- Ensure Tesseract.js is installed: `npm install tesseract.js`
- Check network for first-time language data download
- Try clearing temp directory: `rm -rf ./temp`

### Build fails on Windows

Install Visual Studio Build Tools:
1. Download from https://visualstudio.microsoft.com/downloads/
2. Select "Desktop development with C++"
3. Complete installation
4. Retry build

---

## Configuration

Key settings in `.env`:

- `NODE_ENV`: Set to `production` for release builds
- `DEBUG`: Set to `true` for verbose logging
- `OCR_LANGUAGE`: Language for text recognition
- `EXPORT_DEFAULT_FORMAT`: Default export format
- `TEMP_DIR`: Temporary file storage
- `LOGS_DIR`: Application logs location

---

## Testing

### Manual Testing Checklist

- [ ] Select different screens/windows
- [ ] Capture varies content types
- [ ] Preview displays correctly
- [ ] Navigation (Next/Finish) works
- [ ] Export to all formats succeeds
- [ ] Output files are readable
- [ ] Error messages are clear
- [ ] App closes cleanly

### Testing Content Types

- [ ] Text documents
- [ ] Images/screenshots
- [ ] Web pages
- [ ] PDFs with text
- [ ] MCQ-style content

---

## Development Tips

### Adding New Features

1. Create module in `lib/` folder
2. Add IPC handler in `main.js`
3. Expose in `preload.js`
4. Create React component in `src/components/`
5. Test in development mode

### Debugging

```bash
# Enable debug logging
DEBUG=true npm run dev

# Check logs
cat logs/app-*.log

# Open DevTools in running app
Press: Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (macOS)
```

### Performance Optimization

- Compress images: Use `ImageProcessor.processImages()`
- Lazy load components: `React.lazy()` and `Suspense`
- Debounce OCR calls: Use utility functions
- Cache OCR results: Avoid reprocessing same images

---

## Security Notes

- All processing is local (no cloud upload)
- Temporary files auto-deleted
- No sensitive data collection
- User permission required for captures
- Does not bypass DRM or security

---

## Support & Issues

For bugs or questions:
1. Check troubleshooting section above
2. Review logs in `./logs/` directory
3. Check GitHub issues (if repo available)
4. Provide:
   - OS and version
   - Node version (`node --version`)
   - Error messages and logs
   - Steps to reproduce

---

## License

MIT License - See LICENSE file for details

---

## Next Steps

1. Customize branding (app name, icon)
2. Add language support for OCR
3. Implement audio transcription
4. Add cloud backup feature (optional)
5. Create user documentation

For advanced setup, see DEVELOPMENT.md