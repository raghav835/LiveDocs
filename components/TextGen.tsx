"use client";

import React, { useState } from 'react';

const TextGen: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateText = async () => {
    setLoading(true);
    setOutput(null);
    setError(null);

    try {
      const response = await fetch('/api/generateText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setOutput(data.content || 'No output generated.');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gen-container p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md rounded-md max-w-md mx-auto">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt here..."
        className="text-gen-input text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      />
      <button
        onClick={handleGenerateText}
        className={`text-gen-button w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Text'}
      </button>
      {error && <div className="text-gen-error text-red-500 mt-4">{error}</div>}
      {output && <div className="text-gen-output mt-4 p-3 border border-gray-300 rounded-md text-black max-h-60 overflow-y-auto">
          <pre className="whitespace-pre-wrap break-words font-sans">{output}</pre>
        </div>}
    </div>
  );
};

export default TextGen;
