import React, { useState } from 'react';

const Quiz = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState({});

  const handleSelect = (qIndex, option) => {
    setUserAnswers({ ...userAnswers, [qIndex]: option });
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const selected = userAnswers[index];
        const isCorrect = selected && selected === q.answer;

        return (
          <div key={index} className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-lg font-semibold text-white mb-3">{index + 1}. {q.question}</h3>
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, value]) => (
                <label key={key} className="block">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={key}
                    checked={selected === key}
                    onChange={() => handleSelect(index, key)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">{key}. {value}</span>
                </label>
              ))}
            </div>

            {selected && (
              <p className={`mt-3 font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${q.answer}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Quiz;
