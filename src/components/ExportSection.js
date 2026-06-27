import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExportSection = ({ captures }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [outputDir, setOutputDir] = useState(null);

  const selectOutputDir = async () => {
    try {
      const dir = await window.electronAPI.selectDirectory();
      setOutputDir(dir);
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleExport = async () => {
    if (!outputDir) {
      alert('Please select an output directory first.');
      return;
    }

    setIsExporting(true);
    try {
      const filePath = await window.electronAPI.exportCaptures(exportFormat, captures, outputDir);
      alert(`Exported successfully to ${filePath}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (captures.length === 0) return null;

  return (
    <motion.div
      className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-4">Export Captures</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {captures.length} capture{captures.length !== 1 ? 's' : ''} ready for export
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Output Directory</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={outputDir || ''}
            readOnly
            placeholder="Select output directory..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={selectOutputDir}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Browse
          </button>
        </div>
      </div>

      <div className="mb-4 max-w-xs">
        <label className="block text-sm font-medium mb-2">Export Format</label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="pdf">PDF</option>
          <option value="docx">Word Document</option>
          <option value="txt">Text File</option>
          <option value="json">JSON</option>
          <option value="md">Markdown</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-6 py-2 rounded-lg transition-colors ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
    </motion.div>
  );
};

export default ExportSection;