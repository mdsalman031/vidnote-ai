const BASE_URL = 'http://localhost:8000';

export const generateSummary = async (url) => {
  console.log("Sending request with URL:", url);
  const response = await fetch(`${BASE_URL}/generate-summary/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error response:", errorText);
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();
  return { notes: data.notes, video_id: data.video_id };
};

export const generateQuiz = async (video_url) => {
  const response = await fetch(`${BASE_URL}/generate-quiz/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: video_url }), // ✅ FIXED
  });

  if (!response.ok) throw new Error('Failed to generate quiz');
  const data = await response.json();
  return data.questions;
};

export const generateKeyFrames = async (url) => {
  const response = await fetch(`${BASE_URL}/key-frames/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) throw new Error('Failed to generate key frames');
  const data = await response.json();
  return data.frames; // Should be array of relative paths like /static/keyframes/video123/frame1.jpg
};

export const generateFlashcards = async (youtubeUrl) => {
  const res = await fetch("http://localhost:8000/generate-flashcards/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  });
  return await res.json();
};

export const askDoubt = async (youtubeUrl, question) => {
  const res = await fetch("http://localhost:8000/ask-question/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url: youtubeUrl, question }),
  });

  if (!res.ok) throw new Error("Failed to get answer from chatbot");
  return await res.json(); // { answer: "..." }
};

