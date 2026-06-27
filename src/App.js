import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CaptureButton from './components/CaptureButton';
import Preview from './components/Preview';
import ProgressIndicator from './components/ProgressIndicator';
import ExportSection from './components/ExportSection';
import './App.css';

function App() {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [processedContent, setProcessedContent] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [currentStep, setCurrentStep] = useState('select'); // select, capture, process, preview

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const sources = await window.electronAPI.getSources();
      setSources(sources);
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  };

  const handleCapture = async () => {
    if (!selectedSource) return;

    setIsCapturing(true);
    setCurrentStep('capture');

    try {
      const imagePath = await window.electronAPI.captureScreen(selectedSource.id);
      setCapturedImage(imagePath);
      setCurrentStep('process');

      // Process the image (OCR, etc.)
      const content = await processImage(imagePath);
      setProcessedContent(content);
      setCaptures(prev => [...prev, { imagePath, content }]);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Capture failed:', error);
      alert('Capture failed: ' + (error?.message || String(error)));
    } finally {
      setIsCapturing(false);
    }
  };

  const processImage = async (imagePath) => {
    try {
      const content = await window.electronAPI.processImage(imagePath);
      return content;
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  };

  const handleNext = () => {
    setCapturedImage(null);
    setProcessedContent(null);
    setCurrentStep('select');
  };

  const handleFinish = () => {
    // Generate final output
    generateOutput();
    setCurrentStep('finished');
  };

  const generateOutput = () => {
    // Placeholder for export
    console.log('Generating output...');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Screen Content Capture
        </motion.h1>

        {currentStep === 'select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl mb-4">Select Screen/Window to Capture</h2>
            {sources.length === 0 ? (
              <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
                No screens or windows were detected. Make sure the app is running inside Electron and that screen capture is available on your system.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {sources.map(source => (
                  <div
                    key={source.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSource?.id === source.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSource(source)}
                  >
                    <img src={source.thumbnail} alt={source.name} className="w-full h-32 object-cover rounded mb-2" />
                    <p className="text-sm font-medium">{source.name}</p>
                  </div>
                ))}
              </div>
            )}
            <CaptureButton onClick={handleCapture} disabled={!selectedSource || isCapturing} />
          </motion.div>
        )}

        {currentStep === 'capture' && (
          <ProgressIndicator message="Capturing screen..." />
        )}

        {currentStep === 'process' && (
          <ProgressIndicator message="Processing content..." />
        )}

        {currentStep === 'preview' && processedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Preview content={processedContent} imagePath={capturedImage} />
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Next
              </button>
              <button
                onClick={handleFinish}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Finished
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Capture Finished</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your capture is complete. Use the export section below to save the data in your preferred format.
            </p>
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Capture Again
            </button>
          </motion.div>
        )}

        <ExportSection captures={captures} />
      </div>
    </div>
  );
}

export default App;