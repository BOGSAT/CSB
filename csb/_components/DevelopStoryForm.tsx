"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/app/api/auth/axios";
import { useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type TopicType = "plot" | "characters" | "scenes" | "chapters" | null;

export default function DevelopStoryForm() {
  const [idea, setIdea] = React.useState("");
  const [developedStory, setDevelopedStory] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<TopicType>(null);
  const [wantNewScenarios, setWantNewScenarios] = React.useState(false);
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [genre, setGenre] = useState("fiction");

  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (developedStory && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [developedStory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token || !idea.trim()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/stories/develop-story", {
        idea,
        selectedTopic: selectedTopic,
        isNewScenario: wantNewScenarios,
      });

      setDevelopedStory((prev) => {
        if (prev) {
          return `${prev}\n\n---\n\nNew Response:\n${response.data}`;
        }
        return response.data;
      });

      // Reset states after successful submission
      setIdea("");
      setSelectedTopic(null);
      setWantNewScenarios(false);
    } catch (error) {
      console.error("Failed to develop story idea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: TopicType) => {
    setSelectedTopic(topic);
    setWantNewScenarios(false);

    if (!developedStory.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/stories/develop-story", {
        idea: developedStory,
        selectedTopic: topic,
      });

      setDevelopedStory((prev) => {
        if (prev) {
          return `${prev}\n\n---\n\nDeveloping ${topic}:\n${response.data}`;
        }
        return response.data;
      });
    } catch (error) {
      console.error("Failed to develop topic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewScenarios = async () => {
    setWantNewScenarios(true);
    setSelectedTopic(null);

    if (!developedStory.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/stories/develop-story", {
        idea: developedStory,
        isNewScenario: true,
      });

      setDevelopedStory((prev) => {
        if (prev) {
          return `${prev}\n\n**----------------------------------------------**\n\nNew Scenarios:\n${response.data}`;
        }
        return response.data;
      });
    } catch (error) {
      console.error("Failed to generate new scenarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStory = async (isPublished: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const response = await api.post("/stories", {
        title,
        summary: developedStory,
        status: isPublished ? "published" : "draft",
        genre,
      });

      console.log("Save response:", response);
      toast.success("Story saved successfully!");
      setSaveModalOpen(false);

      // Wait a bit before redirecting
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      console.error("Failed to save story:", error);
      toast.error("Failed to save story");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Story Developer</h1>
          <p className="text-gray-400">Your ideas on paper</p>
        </div>

        {/* Story Display */}
        {developedStory && (
          <div ref={storyRef} className="bg-black p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your Developed Story</h3>
            <div className="prose prose-invert max-w-none">
              {developedStory.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Topic Selection Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-black">
              <Button
                variant="outline"
                onClick={() => handleTopicSelect("plot")}
                className="w-full"
                disabled={isLoading}
              >
                Develop Plot
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTopicSelect("characters")}
                className="w-full"
                disabled={isLoading}
              >
                Develop Characters
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTopicSelect("scenes")}
                className="w-full"
                disabled={isLoading}
              >
                Develop Scenes
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTopicSelect("chapters")}
                className="w-full"
                disabled={isLoading}
              >
                Develop Chapters
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSaveModalOpen(true)}
                className="w-full col-span-2 mt-4 bg-green-200 hover:bg-green-300"
              >
                Save Story
              </Button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-black p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium mb-2">
                Your Story Idea
              </label>
              <Input
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Enter your story idea here..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="secondary"
              disabled={isLoading}
            >
              {isLoading ? "Developing Story..." : "Develop Story"}
            </Button>
          </form>
        </div>
      </div>

      {/* Save Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Save Your Story</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Story Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter story title"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="genre" className="text-sm font-medium">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              >
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="fantasy">Fantasy</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
              </select>
            </div>
          </div>
          <DialogFooter className="sm:justify-start space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSaveStory(false)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => handleSaveStory(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Publish Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
