// src/components/VideoInputForm.jsx
import { useState } from 'react';

const VideoInputForm = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-500/30 backdrop-blur-sm"></div>
        <div className="relative flex gap-2 items-center p-1 bg-gray-900/80 rounded-xl">
          <div className="pl-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Paste YouTube video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-grow bg-transparent border-0 text-white placeholder-gray-400 py-4 px-2 focus:ring-0 focus:outline-none"
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20 mr-2"
            disabled={!url.trim()}
          >
            Generate Notes
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Works with any public YouTube video</span>
        </div>
      </div>
    </form>
  );
};

export default VideoInputForm;