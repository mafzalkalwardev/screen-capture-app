/**
 * Content Organizer - Intelligently structures and aligns captured content
 */

class ContentOrganizer {
  /**
   * Organize captured content intelligently
   * @param {object} ocrContent - OCR extracted content
   * @param {Array} images - Detected images
   * @param {object} audioTranscript - Audio transcription if available
   * @returns {object} Organized content structure
   */
  static organize(ocrContent, images = [], audioTranscript = null) {
    const organized = {
      sections: [],
      metadata: {
        timestamp: new Date().toISOString(),
        contentType: 'screen-capture',
        hasImages: images.length > 0,
        hasAudio: !!audioTranscript,
        mcqCount: ocrContent.mcqs ? ocrContent.mcqs.length : 0
      }
    };

    // Create sections based on detected structure
    organized.sections = this.createSections(ocrContent, images);

    // Add audio if available
    if (audioTranscript) {
      organized.audio = audioTranscript;
    }

    return organized;
  }

  /**
   * Create structured sections from content
   * @param {object} ocrContent - OCR extracted content
   * @param {Array} images - Detected images
   * @returns {Array} Array of content sections
   */
  static createSections(ocrContent, images = []) {
    const sections = [];
    let imageIndex = 0;

    // Add headings as section titles
    if (ocrContent.headings && ocrContent.headings.length > 0) {
      ocrContent.headings.forEach((heading, idx) => {
        const section = {
          type: 'section',
          title: heading,
          level: this.detectHeadingLevel(heading),
          content: [],
          images: []
        };

        // Associate nearby images with this section
        while (imageIndex < images.length && section.images.length < 2) {
          section.images.push(images[imageIndex]);
          imageIndex++;
        }

        sections.push(section);
      });
    }

    // Add MCQs as dedicated sections
    if (ocrContent.mcqs && ocrContent.mcqs.length > 0) {
      const mcqSection = {
        type: 'mcq-section',
        title: 'Multiple Choice Questions',
        questions: ocrContent.mcqs,
        images: []
      };

      // Add remaining images to MCQ section
      while (imageIndex < images.length) {
        mcqSection.images.push(images[imageIndex]);
        imageIndex++;
      }

      sections.push(mcqSection);
    }

    // Add paragraphs content
    if (ocrContent.paragraphs && ocrContent.paragraphs.length > 0) {
      const contentSection = {
        type: 'content-section',
        title: 'Content',
        paragraphs: ocrContent.paragraphs,
        images: []
      };

      sections.push(contentSection);
    }

    return sections;
  }

  /**
   * Detect heading level based on content characteristics
   * @param {string} heading - Heading text
   * @returns {number} Heading level (1-6)
   */
  static detectHeadingLevel(heading) {
    if (heading.length < 20) return 1;
    if (heading.length < 50) return 2;
    if (heading.length < 100) return 3;
    return 4;
  }

  /**
   * Remove duplicate content
   * @param {Array} contents - Array of content items
   * @returns {Array} Deduplicated content
   */
  static deduplicateContent(contents) {
    const seen = new Set();
    return contents.filter(content => {
      const key = typeof content === 'string' ? content : JSON.stringify(content);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Format MCQ for display
   * @param {object} mcq - MCQ object
   * @param {number} index - Question number
   * @returns {string} Formatted MCQ string
   */
  static formatMCQ(mcq, index) {
    let formatted = `${index}. ${mcq.question}\n`;
    
    if (mcq.options && mcq.options.length > 0) {
      const options = ['A', 'B', 'C', 'D', 'E', 'F'];
      mcq.options.forEach((option, idx) => {
        formatted += `${options[idx] || String.fromCharCode(65 + idx)}) ${option}\n`;
      });
    }

    return formatted;
  }

  /**
   * Create table of contents from sections
   * @param {Array} sections - Array of sections
   * @returns {string} Formatted table of contents
   */
  static createTableOfContents(sections) {
    let toc = 'Table of Contents\n=================\n\n';
    
    sections.forEach((section, idx) => {
      if (section.title) {
        const indent = section.level ? '  '.repeat(section.level - 1) : '';
        toc += `${indent}${idx + 1}. ${section.title}\n`;
      }
    });

    return toc;
  }

  /**
   * Generate summary from content
   * @param {object} content - Organized content
   * @returns {string} Content summary
   */
  static generateSummary(content) {
    const stats = {
      sections: content.sections.length,
      questions: 0,
      images: 0,
      paragraphs: 0
    };

    content.sections.forEach(section => {
      if (section.questions) stats.questions += section.questions.length;
      if (section.images) stats.images += section.images.length;
      if (section.paragraphs) stats.paragraphs += section.paragraphs.length;
    });

    return `Content Summary
================
Sections: ${stats.sections}
MCQs: ${stats.questions}
Images: ${stats.images}
Paragraphs: ${stats.paragraphs}
Timestamp: ${content.metadata.timestamp}`;
  }
}

module.exports = ContentOrganizer;