const BASE_URL = 'https://vidnote-ai.onrender.com';

export const generateSummary = async (video_url) => {
  const response = await fetch(`${BASE_URL}/generate-summary/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ video_url }),  // ✅ Correct key
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();

  return {
    notes: data.notes,
    video_id: data.video_id,
  };
};

export const generateQuiz = async (video_url) => {
  const response = await fetch(`${BASE_URL}/generate-quiz/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ video_url }),  // ✅ Correct key
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  const data = await response.json();
  return data.questions;
};
