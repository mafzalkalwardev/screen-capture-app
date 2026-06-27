const { createWorker } = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

class OCRProcessor {
  constructor() {
    this.worker = null;
  }

  async initialize() {
    this.worker = await createWorker();
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
  }

  async processImage(imagePath) {
    if (!this.worker) {
      await this.initialize();
    }

    try {
      const { data: { text } } = await this.worker.recognize(imagePath);
      return this.parseContent(text);
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  parseContent(text) {
    const lines = text.split('\n').filter(line => line.trim());

    const content = {
      text: text,
      headings: [],
      paragraphs: [],
      mcqs: [],
      lists: []
    };

    // Simple parsing logic (can be improved with AI/ML)
    let currentMCQ = null;

    for (const line of lines) {
      const trimmed = line.trim();

      // Detect headings (lines that are short and end with no punctuation or are all caps)
      if (trimmed.length < 100 && /^[A-Z\s]+$/.test(trimmed) && trimmed.length > 5) {
        content.headings.push(trimmed);
      }

      // Detect MCQ questions
      if (/^\d+\.?\s/.test(trimmed) || /^\w\)\s/.test(trimmed)) {
        if (currentMCQ && /^\w\)\s/.test(trimmed)) {
          // Option
          currentMCQ.options.push(trimmed.substring(3));
        } else if (/^\d+\.?\s/.test(trimmed)) {
          // New question
          if (currentMCQ) {
            content.mcqs.push(currentMCQ);
          }
          currentMCQ = {
            question: trimmed.replace(/^\d+\.?\s/, ''),
            options: []
          };
        }
      } else if (currentMCQ && trimmed) {
        // Continue question text
        currentMCQ.question += ' ' + trimmed;
      } else {
        // Regular paragraph
        if (trimmed) {
          content.paragraphs.push(trimmed);
        }
      }
    }

    if (currentMCQ) {
      content.mcqs.push(currentMCQ);
    }

    return content;
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

module.exports = OCRProcessor;