import { useState } from "react";

export default function EmergencyAssistant({ position }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(
        "https://nearhelp-ai.onrender.com/generate-guidance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crisisType: "general",
            latitude: position?.latitude || 0,
            longitude: position?.longitude || 0,
            answers: {
              user_question: question,
            },
          }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-10 bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-slate-800 text-white">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
        Ask Emergency Assistant
      </h3>

      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 
                   focus:outline-none focus:ring-2 focus:ring-red-500/50 
                   text-white placeholder-slate-400 transition"
        rows="3"
        placeholder="Describe the emergency or ask what to do..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="mt-4 bg-gradient-to-r from-red-600 to-rose-600 
                   text-white px-5 py-2 rounded-lg 
                   hover:from-red-700 hover:to-rose-700 
                   transition disabled:opacity-50 shadow-lg"
      >
        {loading ? "Analyzing..." : "Get Guidance"}
      </button>

      {error && (
        <p className="mt-4 text-red-400 font-medium">{error}</p>
      )}

      {response && (
        <div className="mt-6 bg-slate-800/70 p-4 rounded-lg border border-slate-700">
          <p className="font-semibold mb-2">
            Severity:{" "}
            <span className="capitalize text-red-400">
              {response.severity}
            </span>
          </p>

          <ul className="list-disc ml-6 space-y-1 text-slate-300">
            {response.steps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>

          {response.note && (
            <p className="text-sm text-slate-400 mt-3">
              {response.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}