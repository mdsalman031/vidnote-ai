export const generateSummary = async (url) => {
  const response = await fetch('http://localhost:8000/generate-summary/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();

  return {
    notes: data.notes,         // 🧠 Structured HTML notes
    video_id: data.video_id,   // 🆔 Used to poll for frames
  };
};

export const generateQuiz = async (url) => {
  const response = await fetch('http://localhost:8000/generate-quiz/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  const data = await response.json();
  return data.questions; // array of { question, options, answer }
};
