# Quick Start Guide

Get Screen Capture App running in 3 minutes!

## Prerequisites

- Node.js 16+ installed
- npm 8+

Check versions:
```bash
node --version
npm --version
```

## Installation (2 minutes)

```bash
# 1. Navigate to project directory
cd ScreenCaptureApp

# 2. Install dependencies
npm install

# Wait for installation to complete (~2-3 minutes)
```

## Running the App (30 seconds)

### Development Mode (Recommended)
```bash
npm run dev
```

The app will launch automatically with:
- Hot reload on code changes
- DevTools for debugging
- React dev server at http://localhost:3000

### Production Build
```bash
npm run build
npm run dist
```

Creates installable executable in `dist/` folder

---

## First Time Usage

1. **Launch App**
   - Run `npm run dev`
   - Wait for Electron window to open

2. **Select Screen/Window**
   - Choose a screen or window from the list
   - You'll see a preview thumbnail

3. **Capture Content**
   - Click blue "Start Capture" button
   - Wait for processing (shows spinner)
   - View extracted content in preview

4. **Choose Next Steps**
   - Click "Next Capture" to capture more
   - Click "Finish & Export" when done

5. **Export**
   - Select format (PDF, DOCX, JSON, etc.)
   - Click "Browse" to choose output folder
   - Click "Export"
   - Files saved to your selected folder

---

## What Gets Captured

✅ **Text Content**
- Headings
- Paragraphs
- Lists

✅ **Multiple Choice Questions**
- Questions with options
- Numbered format detection

✅ **Images**
- Optimized copies
- Thumbnails
- Preserved order

✅ **Structure**
- Content organization
- Section grouping

---

## Export Formats

- **PDF** - Professional documents with formatting
- **DOCX** - Microsoft Word documents
- **JSON** - Structured data format
- **TXT** - Plain text files
- **MD** - Markdown format

---

## Common Tasks

### Change Default Export Format
Edit `.env` file:
```
EXPORT_DEFAULT_FORMAT=pdf
```

### Enable Debug Logging
```bash
DEBUG=true npm run dev
```

Logs saved to `./logs/app-YYYY-MM-DD.log`

### Access DevTools
While app is running:
- Windows/Linux: `Ctrl + Shift + I`
- macOS: `Cmd + Option + I`

### Change OCR Language
Edit `.env`:
```
OCR_LANGUAGE=eng
```

Supported: eng, fra, deu, spa, ita, por, rus, etc.

---

## Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### npm install takes too long
- Check internet connection
- Try: `npm install --prefer-offline`
- Use different npm registry: `npm config set registry https://registry.npmjs.org/`

### OCR not detecting text
- Try capturing simpler text content first
- Check logs: `tail logs/app-*.log`
- Ensure text is readable in screenshot

### Export fails
- Check that directory exists
- Ensure write permissions
- Try different output directory

---

## System Requirements

| OS | Minimum | Recommended |
|---|---------|-------------|
| Windows | 10/11 64-bit | 11 22H2 |
| macOS | 10.15+ | 13+ |
| Linux | Ubuntu 18.04+ | Ubuntu 22.04+ |

**Memory**: 2GB RAM minimum, 4GB+ recommended

**Disk**: 500MB for installation + dependencies

---

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| DevTools | Ctrl+Shift+I | Cmd+Option+I |
| Reload | Ctrl+R | Cmd+R |
| Quit | Alt+F4 | Cmd+Q |

---

## File Locations

- **Logs**: `./logs/app-*.log`
- **Temp Files**: `./temp/`
- **Builds**: `./build/` (after npm run build)
- **Packages**: `./dist/` (after npm run dist)
- **Settings**: `.env` file

---

## Next Steps

After first run:

1. ✅ Explore different screen/window captures
2. ✅ Try all export formats
3. ✅ Read [SETUP.md](SETUP.md) for detailed setup
4. ✅ Read [DEVELOPMENT.md](DEVELOPMENT.md) for advanced features
5. ✅ Check out [README.md](README.md) for full documentation

---

## Need Help?

1. Check [SETUP.md](SETUP.md) - Common issues and solutions
2. Review [DEVELOPMENT.md](DEVELOPMENT.md) - Technical details
3. Check logs in `./logs/` folder
4. Enable debug mode: `DEBUG=true npm run dev`

---

## Feature Overview

```
Screen Capture App
├── Screen Capture
│   ├── Multiple monitors
│   └── Window selection
├── Content Extraction
│   ├── Text (OCR)
│   ├── Headings
│   ├── Multiple Choice Qs
│   └── Images
├── Export
│   ├── PDF
│   ├── DOCX
│   ├── JSON
│   ├── TXT
│   └── Markdown
└── Organization
    ├── Content grouping
    ├── Image ordering
    └── Structure preservation
```

---

## Tips & Tricks

💡 **Capture full pages** - For long content, capture multiple times and export together

💡 **Best OCR results** - Clear text, good lighting, high resolution screenshots

💡 **Batch processing** - Use Next button to capture multiple screens at once

💡 **Custom formats** - Edit export modules in `lib/export.js` for custom output

---

Enjoy using Screen Capture App! 🚀

For more information, see **README.md** or **DEVELOPMENT.md**