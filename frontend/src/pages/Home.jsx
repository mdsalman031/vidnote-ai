import React, { useState, useEffect, useRef } from 'react';
import VideoInputForm from '../components/VideoInputForm';
import Loader from '../components/Loader';
import ParticlesBackground from '../components/ParticlesBackground';
import Quiz from '../components/Quiz';
import SummaryCard from '../components/SummaryCard';
import { generateSummary, generateQuiz, generateKeyFrames, generateFlashcards } from '../api';
import printJS from 'print-js';
import Flashcards from '../components/Flashcards';
import Chatbot from '../components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [notes, setNotes] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [keyFrames, setKeyFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const featuresRef = useRef(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const featureVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Auto-scroll to results when generated
  useEffect(() => {
    if (notes || quizQuestions.length > 0 || keyFrames.length > 0) {
      setTimeout(() => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [notes, quizQuestions, keyFrames]);

  const handleGenerateSummary = async (youtubeURL) => {
    setLoading(true);
    setYoutubeURL(youtubeURL);
    setNotes('');
    setQuizQuestions([]);
    setKeyFrames([]);
    setFlashcards([]);
    setIsCollapsed(false);
    setShowFeatures(false);

    try {
      const result = await generateSummary(youtubeURL);
      setNotes(result.notes);
      setVideoId(result.video_id);

      const quiz = await generateQuiz(youtubeURL);
      setQuizQuestions(quiz);

      const flashcardsData = await generateFlashcards(youtubeURL);
      setFlashcards(flashcardsData.flashcards);

      const frames = await generateKeyFrames(youtubeURL);
      setKeyFrames(frames);
    } catch (error) {
      alert('Error generating content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    printJS({
      printable: 'structured-notes',
      type: 'html',
      scanStyles: false,
      targetStyles: ['*'],
      css: `
        body { 
          font-family: 'Inter', sans-serif; 
          padding: 20px;
          background: #0f172a;
          color: #e2e8f0;
        }
        h1, h2, h3 { color: #e2e8f0; }
        .prose { max-width: 100% !important; }
      `
    });
  };

  const handleDownloadMarkdown = () => {
    const element = document.getElementById('structured-notes');
    if (!element) return alert('No notes to export');

    const plainText = element.innerText;
    const blob = new Blob([plainText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'VidNote_Summary.md';
    a.click();

    URL.revokeObjectURL(url);
  };

  const calculateTimestamp = (index) => {
    const seconds = index * 10 + 1;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleManualCleanup = async () => {
    try {
      const res = await fetch(`http://localhost:8000/cleanup/${videoId}`, {
        method: 'POST',
      });
      const data = await res.json();
      alert(data.message || 'Cleanup completed successfully!');
    } catch (err) {
      alert('Cleanup failed: ' + err.message);
    }
  };

  // Feature cards data
  const features = [
    {
      icon: '📝',
      title: 'Structured Notes',
      description: 'AI-powered summaries with headings and bullet points'
    },
    {
      icon: '❓',
      title: 'Quiz Generator',
      description: 'Test your knowledge with auto-generated questions'
    },
    {
      icon: '🖼️',
      title: 'Key Frames',
      description: 'Important visual moments captured automatically'
    },
    {
      icon: '🧠',
      title: 'Flashcards',
      description: 'Reinforce learning with interactive flashcards'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-white overflow-hidden relative">
      <ParticlesBackground />
      
      {/* Floating gradient elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-3xl -z-1"></div>
      <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl -z-1"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
              VidNote<span className="text-blue-400">.AI</span>
            </motion.h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform shadow-lg shadow-purple-500/30"
          >
            Sign In
          </motion.button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Videos into <span className="text-blue-400">Structured Notes</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Extract transcripts, generate summaries, key frames, quizzes, and flashcards from any video with AI-powered precision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <VideoInputForm onSubmit={handleGenerateSummary} />
            </div>
            {loading && (
              <div className="mt-10 flex flex-col items-center">
                <Loader />
                <p className="mt-4 text-gray-400">Processing video content with AI...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features section */}
        {showFeatures && (
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Powerful Features
            </h3>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-800/50 to-indigo-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Results section */}
        {(notes || quizQuestions.length > 0 || keyFrames.length > 0 || flashcards.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-16 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
          >
            <div className="flex border-b border-gray-700/50 justify-between items-center px-4">
              <div>
                <button
                  className={`px-6 py-4 font-medium relative ${
                    activeTab === 'notes' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                  {activeTab === 'notes' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    />
                  )}
                </button>
                <button
                  className={`px-6 py-4 font-medium relative ${
                    activeTab === 'flashcards' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('flashcards')}
                >
                  Flashcards
                  {activeTab === 'flashcards' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    />
                  )}
                </button>
                <button
                  className={`px-6 py-4 font-medium relative ${
                    activeTab === 'quiz' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('quiz')}
                >
                  Quizzes
                  {activeTab === 'quiz' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    />
                  )}
                </button>
                <button
                  className={`px-6 py-4 font-medium relative ${
                    activeTab === 'keyframes' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('keyframes')}
                >
                  Key Frames
                  {activeTab === 'keyframes' && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                    />
                  )}
                </button>
              </div>
              <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManualCleanup}
              className="flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Cleanup Storage
            </motion.button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'notes' && notes && (
                    <div className="relative">
                      <div className="flex justify-end mb-4 space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsCollapsed(!isCollapsed)} 
                          className="bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          {isCollapsed ? 'Expand' : 'Collapse'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDownloadPDF} 
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2 rounded-lg transition-all duration-300"
                        >
                          Export as PDF
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDownloadMarkdown} 
                          className="bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 px-4 py-2 rounded-lg transition-all duration-300"
                        >
                          Export as Markdown
                        </motion.button>
                      </div>
                      <div
                        id="structured-notes"
                        className={`prose prose-invert max-w-none bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-h-40 overflow-y-hidden' : ''}`}
                        dangerouslySetInnerHTML={{ __html: notes }}
                      />
                      {isCollapsed && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCollapsed(false)} 
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                          >
                            Show full content
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'flashcards' && flashcards.length > 0 && (
                    <Flashcards cards={flashcards} />
                  )}

                  {activeTab === 'quiz' && quizQuestions.length > 0 && (
                    <Quiz questions={quizQuestions} />
                  )}

                  {activeTab === 'keyframes' && keyFrames.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {keyFrames.map((src, idx) => (
                        <SummaryCard key={idx} frameUrl={src} timestamp={calculateTimestamp(idx)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          {youtubeURL && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChatbot(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg z-50 shadow-blue-500/30 flex items-center justify-center w-16 h-16"
                title="Ask AI about this video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs animate-pulse">
                  <span className="text-white">AI</span>
                </span>
              </motion.button>
              {showChatbot && (
                <Chatbot
                  youtubeURL={youtubeURL}
                  onClose={() => setShowChatbot(false)}
                />
              )}
            </>
          )}
          <p className="mt-8">© {new Date().getFullYear()} VidNote.AI - AI-powered video insights</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;