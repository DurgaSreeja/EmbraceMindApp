import React, { useEffect } from "react";
import { format } from "date-fns";
import { Heart, Calendar, Plus, Smile } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import type { GratitudeEntry } from "../../types";

interface GratitudeEntryWithSentiment extends GratitudeEntry {
  sentiment?: string;
}

const sentimentEmojis: { [key: string]: string } = {
  "Extremely Happy": "🤩",
  "Very Happy": "😊",
  Happy: "🙂",
  Neutral: "😐",
  Sad: "🙁",
  "Very Sad": "😢",
  "Extremely Sad": "😭",
};

export const GratitudeJournal = () => {
  const [entries, setEntries] = React.useState<GratitudeEntryWithSentiment[]>(
    []
  );
  const [newEntry, setNewEntry] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gratitude");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching gratitude entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = async (text: string) => {
    try {
      const response = await axios.post(
        "https://f697-34-125-90-247.ngrok-free.app/analyze-sentiment",
        { text },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.sentiment;
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return "Neutral";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setIsAnalyzing(true);

    try {
      const [gratitudeResponse, sentiment] = await Promise.all([
        axios.post("http://localhost:5000/api/gratitude", {
          content: newEntry.trim(),
        }),
        analyzeSentiment(newEntry.trim()),
      ]);

      const newEntryWithSentiment = {
        ...gratitudeResponse.data,
        sentiment,
      };

      setEntries([newEntryWithSentiment, ...entries]);
      setNewEntry("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving gratitude entry:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string = "Neutral") => {
    const colors: { [key: string]: string } = {
      "Extremely Happy":
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      "Very Happy":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Happy: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
      Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      Sad: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "Very Sad":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Extremely Sad":
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[sentiment] || colors.Neutral;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Gratitude Journal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Take a moment to reflect on what you're grateful for today
        </p>
      </div>

      <div className="mb-8">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Entry
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              What are you grateful for today?
            </label>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="I'm grateful for..."
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Smile className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                {entry.sentiment && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(
                      entry.sentiment
                    )}`}
                  >
                    {sentimentEmojis[entry.sentiment]}
                    {entry.sentiment}
                  </span>
                )}
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {entry.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
