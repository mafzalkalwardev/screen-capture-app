const path = require('path');
const fs = require('fs');

/**
 * Configuration Manager - Loads and manages app configuration
 */
class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from environment and .env file
   * @returns {object} Configuration object
   */
  loadConfig() {
    const config = {
      // Environment
      nodeEnv: process.env.NODE_ENV || 'development',
      debug: process.env.DEBUG === 'true',

      // API
      apiTimeout: parseInt(process.env.API_TIMEOUT || '30000'),

      // OCR
      ocr: {
        language: process.env.OCR_LANGUAGE || 'eng',
        tessdataPrefix: process.env.OCR_TESSDATA_PREFIX || './tessdata'
      },

      // Export
      export: {
        quality: process.env.EXPORT_QUALITY || 'high',
        defaultFormat: process.env.EXPORT_DEFAULT_FORMAT || 'pdf'
      },

      // Audio
      audio: {
        sampleRate: parseInt(process.env.AUDIO_SAMPLE_RATE || '44100'),
        channels: parseInt(process.env.AUDIO_CHANNELS || '1'),
        encoding: process.env.AUDIO_ENCODING || 'mp3'
      },

      // Image
      image: {
        maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH || '1920'),
        maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '1080'),
        compressionLevel: parseInt(process.env.IMAGE_COMPRESSION_LEVEL || '9')
      },

      // Application
      app: {
        title: process.env.APP_TITLE || 'Screen Capture App',
        version: process.env.APP_VERSION || '1.0.0',
        window: {
          width: parseInt(process.env.WINDOW_WIDTH || '1200'),
          height: parseInt(process.env.WINDOW_HEIGHT || '800')
        }
      },

      // Paths
      paths: {
        tempDir: process.env.TEMP_DIR || path.join(__dirname, '..', 'temp'),
        logsDir: process.env.LOGS_DIR || path.join(__dirname, '..', 'logs'),
        outputDir: process.env.OUTPUT_DIR || path.join(__dirname, '..', 'output')
      }
    };

    // Ensure directories exist
    this.ensureDirectories(config.paths);
    return config;
  }

  /**
   * Ensure all required directories exist
   * @param {object} paths - Paths configuration
   */
  ensureDirectories(paths) {
    Object.values(paths).forEach(dir => {
      if (typeof dir === 'string' && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Get configuration value
   * @param {string} path - Configuration path (e.g., 'ocr.language')
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Set configuration value
   * @param {string} path - Configuration path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.config;

    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }

  /**
   * Get entire configuration
   * @returns {object} Full configuration object
   */
  getAll() {
    return this.config;
  }

  /**
   * Print configuration (for debugging)
   */
  printConfig() {
    console.log('Current Configuration:');
    console.log(JSON.stringify(this.config, null, 2));
  }
}

module.exports = new ConfigManager();