import React, { useState, useEffect } from 'react';
import VideoInputForm from '../components/VideoInputForm';
import Loader from '../components/Loader';
import ParticlesBackground from '../components/ParticlesBackground';
import Quiz from '../components/Quiz';
import { generateSummary, generateQuiz } from '../api';
import printJS from 'print-js';

const Home = () => {
  const [notes, setNotes] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);

  const handleGenerateSummary = async (url) => {
    setLoading(true);
    setNotes('');
    setSummaries([]);
    setQuizQuestions([]);
    setIsCollapsed(false);
    setLoadedImages(0);

    try {
      const result = await generateSummary(url);
      setNotes(result.notes);
      setVideoId(result.video_id);

      const quiz = await generateQuiz(url);
      setQuizQuestions(quiz);
    } catch (error) {
      alert('Error generating summary or quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!videoId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/get-frames/${videoId}`);
        const data = await res.json();
        if (data && data.frames?.length > 0) {
          setSummaries(data.frames);
          clearInterval(interval);
        }
      } catch (err) {
        console.log('Polling for frames...');
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [videoId]);

  const handleDownloadPDF = () => {
  printJS({
    printable: 'structured-notes',
    type: 'html',
    scanStyles: false,
    targetStyles: ['*'],
    css: '', // optionally inject your custom CSS
  });
};

  const handleDownloadMarkdown = () => {
  const element = document.getElementById('structured-notes');
  if (!element) return alert('No notes to export');

  const plainText = element.innerText; // Get raw readable content
  const blob = new Blob([plainText], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'VidNote_Summary.md';
  a.click();

  URL.revokeObjectURL(url);
};

  const handleManualCleanup = async () => {
    try {
      const res = await fetch(`http://localhost:8000/cleanup/${videoId}`, {
        method: 'POST',
      });
      const data = await res.json();
      alert(data.message || 'Cleanup completed');
    } catch (err) {
      alert('Cleanup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-white overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              VidNote<span className="text-blue-400">.AI</span>
            </h1>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30">
            Sign In
          </button>
        </header>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Videos into <span className="text-blue-400">Structured Notes</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Extract transcripts, generate summaries, and capture key frames from any YouTube video with AI-powered precision
          </p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <VideoInputForm onSubmit={handleGenerateSummary} />
            </div>
            {loading && (
              <div className="mt-10 flex flex-col items-center">
                <Loader />
                <p className="mt-4 text-gray-400">Processing video content...</p>
              </div>
            )}
          </div>

          {(notes || summaries.length > 0 || quizQuestions.length > 0) && (
            <div className="border-t border-gray-700/50">
              <div className="flex border-b border-gray-700/50 justify-between items-center px-4">
                <div>
                  <button className={`px-6 py-4 font-medium ${activeTab === 'notes' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('notes')}>Notes</button>
                  <button className={`px-6 py-4 font-medium ${activeTab === 'frames' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('frames')}>Key Frames ({summaries.length})</button>
                  <button className={`px-6 py-4 font-medium ${activeTab === 'quiz' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab('quiz')}>Quizzes</button>
                </div>
                {videoId && (
                  <button onClick={handleManualCleanup} className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300">
                    Cleanup Storage
                  </button>
                )}
              </div>

              <div className="p-6">
                {activeTab === 'notes' && notes && (
                  <div className="relative">
                    <div className="flex justify-end mb-4 space-x-3">
                      <button onClick={() => setIsCollapsed(!isCollapsed)} className="bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                        {isCollapsed ? 'Expand' : 'Collapse'}
                      </button>
                      <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2 rounded-lg transition-all duration-300">Export as PDF</button>
                      <button onClick={handleDownloadMarkdown} className="bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 px-4 py-2 rounded-lg transition-all duration-300">Export as Markdown</button>
                    </div>
                    <div id="structured-notes" className={`prose prose-invert max-w-none bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-h-40 overflow-y-hidden' : ''}`} dangerouslySetInnerHTML={{ __html: notes }} />
                    {isCollapsed && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-4">
                        <button onClick={() => setIsCollapsed(false)} className="text-blue-400 hover:text-blue-300 flex items-center">
                          Show full content
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'frames' && summaries.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summaries.map((frameUrl, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8000${frameUrl}`}
                        alt={`Frame ${index}`}
                        className="rounded-lg shadow-md w-full h-auto"
                        onLoad={() => {
                          setLoadedImages((prev) => {
                            const updated = prev + 1;
                            if (updated === summaries.length) {
                              fetch(`http://localhost:8000/cleanup/${videoId}`, {
                                method: 'POST',
                              })
                                .then((res) => res.json())
                                .then((msg) => console.log('Cleanup successful:', msg))
                                .catch((err) => console.error('Cleanup failed:', err));
                            }
                            return updated;
                          });
                        }}
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'quiz' && quizQuestions.length > 0 && (
                  <div>
                    <Quiz questions={quizQuestions} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} VidNote.AI - AI-powered video insights</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
