import { useState } from 'react';
import axios from 'axios';
import './App.css';

const models = [
  { name: 'Mistral 7B', value: 'mistralai/mistral-7b-instruct' },
  { name: 'LLaMA 3 8B', value: 'meta-llama/llama-3-8b-instruct' },
  { name: 'Claude 3 Haiku', value: 'anthropic/claude-3-haiku' },
];

const OPENROUTER_API_KEY = "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";


function App() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [model, setModel] = useState(models[0].value);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return alert("Please enter some code.");
    setLoading(true);
    setReview('');

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages: [
            {
              role: 'user',
              content: `Please review this code and suggest improvements:\n\n${code}`,
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173', // Your frontend URL
            'X-Title': 'CodeReviewerApp',
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setReview(reply);
    } catch (error) {
      console.error(error);
      setReview("❌ Error getting review. Check your API key or model.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-400 font-sans  font-semibold  p-6">
      <div className="max-w-4xl mx-auto bg-gray-500 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">🧠 AI Code Reviewer</h1>

        <textarea
          className="w-full p-4 border bg-gray-300 rounded mb-6 font-mono focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
          rows={10}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 transition duration-300 ease-in-out"
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 transition duration-300 ease-in-out"
            onClick={() => {
              setCode('');
              setReview('');
            }}
          >
            Clear
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">Review:</h2>
        <pre className="bg-gray-100 p-6 rounded whitespace-pre-wrap border border-gray-300">{review}</pre>
      </div>
    </div>
  );
}

export default App;
