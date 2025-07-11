import { useState } from 'react';

const VideoInputForm = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!url.trim()) {
    alert("Please enter a valid YouTube URL");
    return;
  }

  onSubmit(url.trim()); // trim removes accidental whitespace
};


  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-500/30 backdrop-blur-sm"></div>
        <div className="relative flex gap-2 items-center p-1 bg-gray-900/80 rounded-xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter YouTube video URL"
            className="flex-grow bg-transparent text-white placeholder-gray-400 py-4 px-2 focus:ring-0 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20 mr-2"
            disabled={!url}
          >
            Generate
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideoInputForm;
