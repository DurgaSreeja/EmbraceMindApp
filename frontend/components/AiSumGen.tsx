import React, { useState } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Story {
  content: string;
  theme: string;
}

export const StoryGenerator = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("adventure");

  const themes = [
    { id: "adventure", label: "Adventure" },
    { id: "fantasy", label: "Fantasy" },
    { id: "mystery", label: "Mystery" },
    { id: "scifi", label: "Sci-Fi" },
  ];

  const generateStory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:7000/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: selectedTheme }),
      });

      const data = await response.json();
      // Process the story text to handle bold markers (**text**)
      setStory({
        content: data.story,
        theme: selectedTheme,
      });
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render text with bold sections
  const renderStoryText = (text: string) => {
    // Split the text by bold markers (**) and map through the parts
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove the ** markers and render as bold
        return (
          <strong key={index} className="text-indigo-600 dark:text-indigo-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Story Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Generate unique stories to inspire and entertain
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose a Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTheme === theme.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateStory}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Story...
            </>
          ) : (
            <>
              <BookOpen className="w-5 h-5" />
              Generate Story
            </>
          )}
        </button>

        <AnimatePresence mode="wait">
          {story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose dark:prose-invert max-w-none"
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-200">
                    {themes.find((t) => t.id === story.theme)?.label}
                  </span>
                </div>
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {renderStoryText(story.content)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
