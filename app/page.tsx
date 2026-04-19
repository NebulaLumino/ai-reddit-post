"use client";
import { useState } from "react";

export default function Home() {
  const [postType, setPostType] = useState("Story / Experience");
  const [topic, setTopic] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [targetKarma, setTargetKarma] = useState("500+ upvotes");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postType, topic, subreddits, targetKarma }),
    });
    const data = await res.json();
    setOutput(data.result || data.error || "No output.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
          🏰 AI Reddit Post Generator
        </h1>
        <p className="text-gray-400 mb-8">Generate Reddit posts optimized for upvotes with perfect subreddit targeting, title hooks, body structure, and engagement tips.</p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Post Type</label>
              <select value={postType} onChange={e => setPostType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>Story / Experience</option>
                <option>Question / Advice</option>
                <option>Guide / Tutorial</option>
                <option>Meme / Humor</option>
                <option>Discussion / Poll</option>
                <option>AMA (Ask Me Anything)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Topic / Theme</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} required placeholder="e.g. My journey from $0 to $100K in SaaS" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Subreddits (optional)</label>
              <input value={subreddits} onChange={e => setSubreddits(e.target.value)} placeholder="e.g. r/Entrepreneur, r/SaaS" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upvote Goal</label>
              <select value={targetKarma} onChange={e => setTargetKarma(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>100+ upvotes</option>
                <option>500+ upvotes</option>
                <option>1,000+ upvotes</option>
                <option>5,000+ upvotes (viral)</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-700 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-orange-500/20">
            {loading ? "Generating Post…" : "✨ Generate Reddit Post"}
          </button>
        </form>

        {output && (
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Generated Reddit Post</h2>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </main>
  );
}
