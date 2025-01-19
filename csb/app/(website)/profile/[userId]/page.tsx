"use client";

import { useState, useEffect } from "react";
import api from "@/app/api/auth/axios";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/_components/NavBar";

interface UserData {
  _id: string;
  username: string;
  bio?: string;
  // add other user fields
}

interface Story {
  _id: string;
  title: string;
  summary: string;
  genre: string;
}

export default function UserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, storiesRes] = await Promise.all([
          api.get(`/users/${params.userId}`),
          api.get(`/stories/published?userId=${params.userId}`),
        ]);
        setUserData(userRes.data);
        setUserStories(storiesRes.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-black w-full min-h-screen">
      <NavBar />
      <div className="container mx-auto p-6">
        {/* User Profile Header */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            {userData.username}
          </h1>
          {userData.bio && <p className="text-gray-300">{userData.bio}</p>}
        </div>

        {/* User's Published Stories */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Published Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStories.map((story) => (
              <div key={story._id} className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-300 mb-4">{story.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{story.genre}</span>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Add navigation to full story
                      window.location.href = `/stories/${story._id}`;
                    }}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {userStories.length === 0 && (
            <p className="text-gray-400 text-center">
              This user hasn't published any stories yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
