import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Quiz = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (qIndex, optionKey) => {
    if (userAnswers[qIndex]) return; // prevent re-answering
    setUserAnswers({ ...userAnswers, [qIndex]: optionKey });
  };

  const calculateScore = () => {
    return questions.reduce((total, q, index) => {
      return total + (userAnswers[index] === q.answer ? 1 : 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length !== questions.length) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setScore(calculateScore());
      setShowResults(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handleRetry = () => {
    setUserAnswers({});
    setScore(null);
    setShowResults(false);
  };

  // Progress tracking
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/30 text-center">
        <p className="text-gray-300">No quiz questions available for this video.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Quiz Progress</h3>
          <span className="text-gray-400">{answeredCount}/{questions.length} answered</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {questions.map((q, index) => {
            const selected = userAnswers[index];
            const isCorrect = selected === q.answer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm"
              >
                <div className="flex items-start mb-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{q.question}</h3>
                </div>
                
                <div className="space-y-3 ml-11">
                  {Object.entries(q.options).map(([key, value]) => {
                    const isSelected = selected === key;
                    const isCorrectOption = key === q.answer;
                    
                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selected
                            ? isCorrectOption
                              ? 'bg-green-900/30 border border-green-500/50'
                              : isSelected
                              ? 'bg-red-900/30 border border-red-500/50'
                              : 'bg-gray-700/30'
                            : 'bg-gray-700/30 hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleSelect(index, key)}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                            selected
                              ? isCorrectOption
                                ? 'border-green-500 bg-green-500/20'
                                : isSelected
                                ? 'border-red-500 bg-red-500/20'
                                : 'border-gray-500'
                              : 'border-gray-500'
                          }`}>
                            {isSelected && (
                              <div className={`w-3 h-3 rounded-full ${
                                isCorrect ? 'bg-green-400' : 'bg-red-400'
                              }`}></div>
                            )}
                          </div>
                          
                          <span
                            className={`${
                              selected && isCorrectOption
                                ? 'text-green-400 font-medium'
                                : selected && isSelected
                                ? 'text-red-400 font-medium'
                                : 'text-gray-300'
                            }`}
                          >
                            {key}. {value}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-3 rounded-lg ${
                      isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {isCorrect ? (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Correct! Well done.
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Incorrect. The correct answer is {q.answer}: {q.options[q.answer]}
                        </span>
                      )}
                    </p>
                    {q.explanation && (
                      <p className="mt-2 text-gray-300">
                        <span className="font-medium">Explanation:</span> {q.explanation}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          
          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={answeredCount !== questions.length || isSubmitting}
              className={`bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 
                text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 
                shadow-lg shadow-purple-500/20 ${answeredCount !== questions.length || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating Results...
                </span>
              ) : (
                'Submit Answers'
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm text-center"
        >
          <div className="mb-6">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              {score}/{questions.length}
            </div>
            <div className="text-2xl font-medium text-white mb-1">
              {score === questions.length ? 'Perfect Score! 🎉' : score >= questions.length/2 ? 'Well Done! 👍' : 'Keep Practicing! 💪'}
            </div>
            <div className="text-gray-400">
              {Math.round((score / questions.length) * 100)}% Correct
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-900/30 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{score}</div>
              <div className="text-gray-400">Correct</div>
            </div>
            <div className="p-4 bg-gray-900/30 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{questions.length - score}</div>
              <div className="text-gray-400">Incorrect</div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;