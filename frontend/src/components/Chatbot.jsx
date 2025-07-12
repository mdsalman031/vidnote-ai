import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askDoubt } from '../api';

const Chatbot = ({ youtubeURL, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const newQuestion = question;
    setQuestion('');
    
    // Add user question to history immediately
    setHistory(prev => [...prev, { role: 'user', content: newQuestion }]);
    
    try {
      const response = await askDoubt(youtubeURL, newQuestion);
      setAnswer(response.answer);
      setHistory(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (err) {
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setAnswer('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-950"></div>
            </div>
            <h2 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Video Assistant
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={clearHistory}
              className="p-1.5 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors"
              title="Clear chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors"
              title="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-900/50 to-indigo-950/50">
          <AnimatePresence>
            {history.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-4"
              >
                <div className="mb-4 p-3 bg-indigo-900/30 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ask about this video</h3>
                <p className="text-gray-400 max-w-xs">
                  I can answer questions about the content in this video. Try asking:
                </p>
                <div className="mt-4 space-y-2 text-left w-full max-w-xs">
                  <div className="p-3 bg-indigo-900/30 rounded-lg text-gray-300 text-sm">
                    "Can you summarize the main points?"
                  </div>
                  <div className="p-3 bg-indigo-900/30 rounded-lg text-gray-300 text-sm">
                    "What was said about [topic]?"
                  </div>
                </div>
              </motion.div>
            )}

            {history.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-700 to-purple-700 rounded-br-none'
                      : 'bg-gray-800/70 border border-gray-700 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-start">
                    {message.role === 'assistant' && (
                      <div className="mr-2 mt-0.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="text-white">
                      {message.role === 'assistant' && (
                        <div className="font-medium text-purple-400 mb-1">Video Assistant</div>
                      )}
                      {message.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="max-w-[80%] rounded-2xl p-4 bg-gray-800/70 border border-gray-700 rounded-bl-none">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about the video..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 pr-10 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                rows={1}
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className={`absolute right-2 bottom-2 p-1 rounded-full ${
                  loading || !question.trim()
                    ? 'text-gray-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <div>Press Enter to send</div>
            <div>Shift+Enter for new line</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;