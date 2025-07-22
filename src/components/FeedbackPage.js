import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [usefulness, setUsefulness] = useState(3);
  const [accuracy, setAccuracy] = useState(3);
  const [comments, setComments] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'OPEN_ROUTER_API_KEY',
        },
        body: JSON.stringify({ usefulness, accuracy, comments }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit feedback');

      setSuccess(true);

      setTimeout(() => navigate('/'), 3000); // Wait before navigating
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white px-4">
      {success ? (
        <div
          className="text-center p-6 bg-gray-800 rounded-lg shadow-md transition-opacity duration-1000 ease-in opacity-0 animate-fadeIn"
        >
          <h1 className="text-3xl font-bold text-green-400 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-300">Your feedback has been submitted successfully.</p>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-800">
          <h2 className="text-white font-semibold text-xl mb-4">Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block">
                <span className="text-white font-medium text-sm">Usefulness (1-5)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={usefulness}
                  onChange={(e) => setUsefulness(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-300 mt-1">Selected: {usefulness}</div>
              </label>
            </div>
            <div className="mb-4">
              <label className="block">
                <span className="text-white font-medium text-sm">Accuracy (1-5)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={accuracy}
                  onChange={(e) => setAccuracy(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-300 mt-1">Selected: {accuracy}</div>
              </label>
            </div>
            <div className="mb-4">
              <label className="block">
                <span className="text-white font-medium text-sm">Comments</span>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </label>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex space-x-2">
              <button type="button" className="w-1/2 p-2 bg-gray-600 hover:bg-gray-700 rounded" onClick={() => navigate('/')}>
                Back
              </button>
              <button type="submit" className="w-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
