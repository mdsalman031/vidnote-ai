// src/components/Loader.jsx
const Loader = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-purple-500 rounded-full animate-spin-reverse"></div>
      <div className="absolute inset-4 border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin-slow"></div>
    </div>
    <p className="mt-4 text-gray-300">Processing video content with AI...</p>
    <div className="mt-4 flex space-x-2">
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

export default Loader;