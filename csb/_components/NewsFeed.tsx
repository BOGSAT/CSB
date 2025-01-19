// components/Newsfeed.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/app/api/auth/axios";
import Link from "next/link";

interface Author {
  _id: string;
  name: string;
}

interface Story {
  _id: string;
  userId: string;
  title: string;
  summary: string;
  authorId: string | Author;
  genre: string;
  status: string;
  view_count: number;
  createdAt: string;
}

interface SearchFilters {
  genre?: string;
  authorId?: string;
  title?: string;
  userId?: string;
}

export default function Newsfeed() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchStories = async (searchFilters: SearchFilters = {}) => {
    setIsLoading(true);
    try {
      const queryParams = Object.entries(searchFilters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const response = await api.get(`/stories/published?${queryParams}`);
      setStories(response.data);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStories(filters);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-black p-6 rounded-lg">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="Search by title"
                  className="w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <Input
                  type="text"
                  placeholder="Search by genre"
                  className="w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, genre: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Author ID
                </label>
                <Input
                  type="text"
                  placeholder="Search by author ID"
                  className="w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, authorId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  User ID
                </label>
                <Input
                  type="text"
                  placeholder="Search by user ID"
                  className="w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, userId: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        <div className="bg-black grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div key={story._id} className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{story.title}</h3>
              {/* Check if authorId is an object with _id and name */}
              {typeof story.authorId === "object" && story.authorId?._id ? (
                <Link href={`/profile/${story.authorId._id}`}>
                  <span className="text-blue-400">
                    By {story.authorId.name}
                  </span>
                </Link>
              ) : (
                <span className="text-gray-400">By Unknown Author</span>
              )}
              <p className="text-gray-400 mb-4">{story.summary}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Genre: {story.genre}</span>
                <span>Views: {story.view_count}</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Posted: {new Date(story.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = `/story/${story._id}`)}
                >
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">
            No stories found. Try adjusting your search filters.
          </div>
        )}
      </div>
    </div>
  );
}
