const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ImageProcessor {
  /**
   * Process and extract images from screenshots
   * @param {string} imagePath - Path to the source image
   * @param {string} outputDir - Directory to save processed images
   * @returns {Promise<Array>} Array of processed image information
   */
  async processImages(imagePath, outputDir) {
    try {
      const metadata = await sharp(imagePath).metadata();
      
      // Create a thumbnail for preview
      const thumbnailPath = path.join(outputDir, `thumbnail-${Date.now()}.jpg`);
      await sharp(imagePath)
        .resize(200, 200, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Save optimized version
      const optimizedPath = path.join(outputDir, `optimized-${Date.now()}.png`);
      await sharp(imagePath)
        .png({ compressionLevel: 9 })
        .toFile(optimizedPath);

      return {
        original: imagePath,
        thumbnail: thumbnailPath,
        optimized: optimizedPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size
        }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Detect image regions in a screenshot (placeholder implementation)
   * @param {string} imagePath - Path to the image
   * @returns {Promise<Array>} Array of detected image regions
   */
  async detectImageRegions(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      
      // Placeholder: In a real implementation, use computer vision
      // to detect actual image content regions
      return [
        {
          x: 0,
          y: 0,
          width: metadata.width,
          height: metadata.height,
          confidence: 1.0
        }
      ];
    } catch (error) {
      throw new Error(`Image detection failed: ${error.message}`);
    }
  }

  /**
   * Extract and crop specific regions from an image
   * @param {string} imagePath - Source image path
   * @param {Array} regions - Array of regions to crop
   * @param {string} outputDir - Output directory
   * @returns {Promise<Array>} Array of cropped image paths
   */
  async cropRegions(imagePath, regions, outputDir) {
    try {
      const crops = [];
      
      for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const cropPath = path.join(outputDir, `crop-${i}-${Date.now()}.png`);
        
        await sharp(imagePath)
          .extract({
            left: Math.floor(region.x),
            top: Math.floor(region.y),
            width: Math.floor(region.width),
            height: Math.floor(region.height)
          })
          .toFile(cropPath);
        
        crops.push({
          index: i,
          path: cropPath,
          originalRegion: region
        });
      }
      
      return crops;
    } catch (error) {
      throw new Error(`Cropping failed: ${error.message}`);
    }
  }
}

module.exports = ImageProcessor;