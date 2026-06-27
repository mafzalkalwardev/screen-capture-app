import React from 'react';
import { motion } from 'framer-motion';

const Preview = ({ content, imagePath }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Captured Content Preview</h2>

      {imagePath && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Screenshot</h3>
          <img src={`file://${imagePath}`} alt="Captured screen" className="max-w-full h-auto rounded border" />
        </div>
      )}

      {content && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Extracted Text</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded whitespace-pre-wrap">
            {content.text}
          </div>

          {content.mcqs && content.mcqs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Multiple Choice Questions</h3>
              {content.mcqs.map((mcq, index) => (
                <div key={index} className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded">
                  <p className="font-medium mb-2">{mcq.question}</p>
                  <ul className="list-disc list-inside">
                    {mcq.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {content.headings && content.headings.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Headings</h3>
              <ul className="list-disc list-inside">
                {content.headings.map((heading, index) => (
                  <li key={index}>{heading}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Preview;