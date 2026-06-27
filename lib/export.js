const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');

class ExportManager {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  async exportToPDF(captures, fileName = 'output.pdf') {
    const doc = new PDFDocument();
    const filePath = path.join(this.outputDir, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    for (let i = 0; i < captures.length; i++) {
      const capture = captures[i];

      if (i > 0) doc.addPage();

      doc.fontSize(18).text(`Capture ${i + 1}`, { underline: true });
      doc.moveDown();

      if (capture.content.headings.length > 0) {
        doc.fontSize(14).text('Headings:', { underline: true });
        capture.content.headings.forEach(heading => {
          doc.fontSize(12).text(`• ${heading}`);
        });
        doc.moveDown();
      }

      if (capture.content.mcqs.length > 0) {
        doc.fontSize(14).text('Multiple Choice Questions:', { underline: true });
        capture.content.mcqs.forEach((mcq, index) => {
          doc.fontSize(12).text(`${index + 1}. ${mcq.question}`);
          mcq.options.forEach(option => {
            doc.text(`   ${option}`);
          });
          doc.moveDown(0.5);
        });
      }

      if (capture.content.paragraphs.length > 0) {
        doc.fontSize(14).text('Content:', { underline: true });
        capture.content.paragraphs.forEach(paragraph => {
          doc.fontSize(12).text(paragraph);
          doc.moveDown(0.5);
        });
      }
    }

    doc.end();
    return filePath;
  }

  async exportToDOCX(captures, fileName = 'output.docx') {
    const filePath = path.join(this.outputDir, fileName);

    const children = [];

    for (let i = 0; i < captures.length; i++) {
      const capture = captures[i];

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Capture ${i + 1}`,
              bold: true,
              size: 32
            })
          ]
        })
      );

      if (capture.content.headings.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Headings:',
                bold: true,
                underline: {}
              })
            ]
          })
        );
        capture.content.headings.forEach(heading => {
          children.push(
            new Paragraph({
              children: [
                new TextRun(`• ${heading}`)
              ],
              indent: { left: 720 }
            })
          );
        });
      }

      if (capture.content.mcqs.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Multiple Choice Questions:',
                bold: true,
                underline: {}
              })
            ]
          })
        );
        capture.content.mcqs.forEach((mcq, index) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun(`${index + 1}. ${mcq.question}`)
              ]
            })
          );
          mcq.options.forEach(option => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun(`   ${option}`)
                ],
                indent: { left: 720 }
              })
            );
          });
        });
      }

      if (capture.content.paragraphs.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Content:',
                bold: true,
                underline: {}
              })
            ]
          })
        );
        capture.content.paragraphs.forEach(paragraph => {
          children.push(
            new Paragraph({
              children: [
                new TextRun(paragraph)
              ]
            })
          );
        });
      }

      if (i < captures.length - 1) {
        children.push(new Paragraph({ children: [new TextRun('')] }));
      }
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async exportToJSON(captures, fileName = 'output.json') {
    const filePath = path.join(this.outputDir, fileName);
    const data = {
      timestamp: new Date().toISOString(),
      captures: captures
    };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  async exportToTXT(captures, fileName = 'output.txt') {
    const filePath = path.join(this.outputDir, fileName);
    let content = `Screen Capture Export - ${new Date().toISOString()}\n\n`;

    captures.forEach((capture, index) => {
      content += `Capture ${index + 1}\n`;
      content += '=' .repeat(20) + '\n\n';

      if (capture.content.headings.length > 0) {
        content += 'Headings:\n';
        capture.content.headings.forEach(heading => {
          content += `• ${heading}\n`;
        });
        content += '\n';
      }

      if (capture.content.mcqs.length > 0) {
        content += 'Multiple Choice Questions:\n';
        capture.content.mcqs.forEach((mcq, idx) => {
          content += `${idx + 1}. ${mcq.question}\n`;
          mcq.options.forEach(option => {
            content += `   ${option}\n`;
          });
          content += '\n';
        });
      }

      if (capture.content.paragraphs.length > 0) {
        content += 'Content:\n';
        capture.content.paragraphs.forEach(paragraph => {
          content += `${paragraph}\n\n`;
        });
      }

      content += '\n';
    });

    await fs.writeFile(filePath, content);
    return filePath;
  }

  async exportToMarkdown(captures, fileName = 'output.md') {
    const filePath = path.join(this.outputDir, fileName);
    let content = `# Screen Capture Export\n\n*Generated on ${new Date().toISOString()}*\n\n`;

    captures.forEach((capture, index) => {
      content += `## Capture ${index + 1}\n\n`;

      if (capture.content.headings.length > 0) {
        content += '### Headings\n\n';
        capture.content.headings.forEach(heading => {
          content += `- ${heading}\n`;
        });
        content += '\n';
      }

      if (capture.content.mcqs.length > 0) {
        content += '### Multiple Choice Questions\n\n';
        capture.content.mcqs.forEach((mcq, idx) => {
          content += `${idx + 1}. ${mcq.question}\n\n`;
          mcq.options.forEach(option => {
            content += `   - ${option}\n`;
          });
          content += '\n';
        });
      }

      if (capture.content.paragraphs.length > 0) {
        content += '### Content\n\n';
        capture.content.paragraphs.forEach(paragraph => {
          content += `${paragraph}\n\n`;
        });
      }
    });

    await fs.writeFile(filePath, content);
    return filePath;
  }

  async export(format, captures, fileName) {
    switch (format) {
      case 'pdf':
        return await this.exportToPDF(captures, fileName);
      case 'docx':
        return await this.exportToDOCX(captures, fileName);
      case 'json':
        return await this.exportToJSON(captures, fileName);
      case 'txt':
        return await this.exportToTXT(captures, fileName);
      case 'md':
        return await this.exportToMarkdown(captures, fileName);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}

module.exports = ExportManager;