import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { motion } from 'framer-motion';

const Flashcards = ({ cards }) => {
  const [flipped, setFlipped] = useState(Array(cards.length).fill(false));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const newFlipped = [...flipped];
      newFlipped[currentIndex - 1] = false;
      setFlipped(newFlipped);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const newFlipped = [...flipped];
      newFlipped[currentIndex + 1] = false;
      setFlipped(newFlipped);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      
      {/* Card counter */}
      <div className="text-gray-500 mb-6 font-medium">
        Card {currentIndex + 1} of {cards.length}
      </div>
      
      {/* Main flashcard */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <ReactCardFlip 
          isFlipped={flipped[currentIndex]} 
          flipDirection="horizontal"
          containerStyle={{ perspective: '1000px' }}
        >
          {/* Front of the card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl cursor-pointer h-80 flex flex-col"
            onClick={() => handleFlip(currentIndex)}
          >
            <div className="absolute top-5 right-5 bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center overflow-hidden">
              <h3 className="text-2xl font-bold text-center mb-4 px-2 overflow-y-auto max-h-[60%]">
                {cards[currentIndex].question}
              </h3>
            </div>
            
            <div className="mt-auto w-full">
              <div className="text-center text-white/80 mb-2">
                Click to reveal answer
              </div>
              <div className="flex justify-center">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-white/30 rounded-full mx-1 animate-pulse" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back of the card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-green-500 via-teal-600 to-emerald-700 text-white p-8 rounded-2xl shadow-xl cursor-pointer h-80 flex flex-col"
            onClick={() => handleFlip(currentIndex)}
          >
            <div className="absolute top-5 right-5 bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center overflow-hidden">
              <h3 className="text-2xl font-bold text-center mb-4 px-2 overflow-y-auto max-h-[50%]">
                {cards[currentIndex].answer}
              </h3>
              
              {cards[currentIndex].explanation && (
                <p className="text-white/90 text-center px-2 overflow-y-auto max-h-[40%]">
                  {cards[currentIndex].explanation}
                </p>
              )}
            </div>
            
            <div className="mt-auto w-full">
              <div className="text-center text-white/80">
                Click to flip back
              </div>
            </div>
          </motion.div>
        </ReactCardFlip>
      </motion.div>

      {/* Navigation controls */}
      <div className="flex justify-center mt-10 space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-3 rounded-full font-medium shadow-lg ${
            currentIndex === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white'
          }`}
        >
          ← Previous
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className={`px-8 py-3 rounded-full font-medium shadow-lg ${
            currentIndex === cards.length - 1
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
          }`}
        >
          Next →
        </motion.button>
      </div>

      {/* Card selector */}
      <div className="flex flex-wrap justify-center mt-8 gap-2">
        {cards.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCurrentIndex(index);
              const newFlipped = [...flipped];
              newFlipped[index] = false;
              setFlipped(newFlipped);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index === currentIndex
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;