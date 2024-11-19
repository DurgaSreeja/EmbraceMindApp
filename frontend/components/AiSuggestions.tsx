import React, { useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type SuggestionType = "mood" | "gratitude" | "checkin";

export const AiSuggestions = () => {
  const [type, setType] = useState<SuggestionType>("mood");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  // This would typically call your AI service
  const generateSuggestion = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const suggestions = {
        mood: "Today I'm feeling energized and optimistic. The morning sunshine and my productive start to the day have really lifted my spirits. I noticed some challenges with...",
        gratitude:
          "I'm grateful for the unexpected call from an old friend today. Their words of encouragement came at just the right moment. I'm also thankful for...",
        checkin:
          "Sleep was restful last night, about 7 hours. Anxiety levels are low today. I completed my morning meditation and took a short walk which helped clear my mind...",
      };
      setSuggestion(suggestions[type]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Writing Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get AI-powered suggestions for your wellness journey
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <div className="flex gap-4 mb-8">
          {[
            { value: "mood", label: "Mood Entry" },
            { value: "gratitude", label: "Gratitude Entry" },
            { value: "checkin", label: "Daily Check-in" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setType(option.value as SuggestionType)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                type === option.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={generateSuggestion}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
            Generate{" "}
            {type === "mood"
              ? "Mood Entry"
              : type === "gratitude"
              ? "Gratitude Entry"
              : "Check-in"}
          </button>
        </motion.div>

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Suggested Entry
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {suggestion}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
