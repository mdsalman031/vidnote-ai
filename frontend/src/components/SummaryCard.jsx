import React, { useState } from 'react';

const SummaryCard = ({ frameUrl, timestamp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fullImageUrl = `http://localhost:8000${frameUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullImageUrl;
    link.download = frameUrl.split('/').pop(); // file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
      >
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
          <img
            src={fullImageUrl}
            alt="Key frame"
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute bottom-3 left-3 z-20 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {timestamp || '00:00'}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-white mb-2">Video Frame Analysis</h3>
          <p className="text-gray-400 text-sm">
            This frame shows a key moment with important visual information captured by AI.
          </p>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-purple-600/30 backdrop-blur-sm flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent modal open
                handleDownload();
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto bg-gray-900 rounded-xl shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>
            <img src={fullImageUrl} alt="Enlarged frame" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryCard;
