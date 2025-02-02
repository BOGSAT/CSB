"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Save,
  Trash,
  UploadCloud,
  X,
  SquareArrowOutUpRight,
  Maximize2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/app/api/auth/axios";
import { toast } from "sonner";
import { useTheme } from "@/app/providers/ThemeProvider";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Story {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  // Add other fields as needed
}

interface ProfileInfoProps {
  stories: Story[];
}

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
}

export default function Profile() {
  const { theme } = useTheme();
  const router = useRouter();
  const [publishedStories, setPublishedStories] = useState([]);
  const [draftStories, setDraftStories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stories, setStories] = useState([]);
  const [openStory, setOpenStory] = useState<Story | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar: "",
  });
  const [tempProfile, setTempProfile] = useState(profile);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get(`/users/profile/${userId}`);
        console.log("Fetched profile data:", response.data);

        setProfile({
          username: response.data.userName || "",
          bio: response.data.bio || "",
          avatar: response.data.profilePicture || "",
        });

        setTempProfile({
          username: response.data.userName || "",
          bio: response.data.bio || "",
          avatar: response.data.profilePicture || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");
      console.log("Token in fetchStories:", token ? "exists" : "missing");

      if (!token) return;

      try {
        console.log("Fetching stories...");
        const [publishedRes, draftsRes] = await Promise.all([
          api.get("/stories/published"),
          api.get("/stories/drafts"),
        ]);
        setPublishedStories(publishedRes.data);
        setDraftStories(draftsRes.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log("Auth error - token might be invalid");
        }
        console.error("Failed to fetch stories:", error);
      }
    };

    fetchStories();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!currentUserId || !token) {
      toast.error("Please log in to update your profile picture");
      return;
    }

    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", currentUserId);

        const response = await api.post("/users/profile/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.profilePicture) {
          setProfile((prev) => ({
            ...prev,
            avatar: response.data.profilePicture,
          }));
          toast.success("Profile picture updated successfully");
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(
          error.response?.data?.message || "Failed to update profile picture"
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Not authenticated");
      return;
    }

    try {
      // Send update to backend
      const response = await api.put(`/users/profile`, {
        userId: userId,
        userName: tempProfile.username,
        bio: tempProfile.bio,
      });

      // If successful, update local state
      if (response.data) {
        setProfile(tempProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile changes");
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const deletePost = async (storyId: string) => {
    try {
      const response = await api.delete(`/stories/${storyId}`);

      // Check if the response was successful
      if (response.status === 200 || response.status === 204) {
        toast.success("Story deleted successfully");

        setStories((prevStories) =>
          prevStories.filter((story) => story._id !== storyId)
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete story";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete story");
      }
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div className={`grid grid-cols-2 gap-4`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl">Profile Information</h1>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Username</label>
                <Input
                  value={tempProfile.username}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, username: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm mb-1 block">Bio</label>
                <Textarea
                  value={tempProfile.bio}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, bio: e.target.value })
                  }
                  className="w-full min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Username
                </label>
                <p className="text-lg">{profile.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Bio</label>
                <p>{profile.bio}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl mb-6 text-center">Profile picture</h1>
          <div className="flex justify-center">
            <div className="relative group w-32 h-32">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={profile.avatar}
                  alt={profile.username}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <AvatarFallback>
                  {profile.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                <Input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <div className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5" />
                    <span className="text-sm">Upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-6 mb-2" />
      <div className="container mx-auto">
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="published">Published Stories</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {publishedStories.map((story: any) => (
                <div key={story._id} className="bg-white/10 p-4 rounded-lg">
                  <h3 className="text-white font-bold mb-2">{story.title}</h3>
                  <div className="flex gap-2s">
                    <Button
                      variant="ghost"
                      onClick={() => setOpenStory(story)}
                      className="flex items-center gap-2 bg-green-600"
                    >
                      <SquareArrowOutUpRight className="h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-white mb-2"
                      onClick={() => deletePost(story._id)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{story.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{story.genre}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {draftStories.map((story: any) => (
                <div key={story._id} className="bg-white/10 p-4 rounded-lg">
                  <h3 className="text-white font-bold mb-2">{story.title}</h3>
                  <div className="flex gap-2s">
                    <Button
                      variant="ghost"
                      onClick={() => setOpenStory(story)}
                      className="flex items-center gap-2 bg-green-600"
                    >
                      <SquareArrowOutUpRight className="h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-white mb-2"
                      onClick={() => deletePost(story._id)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{story.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{story.genre}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={!!openStory} onOpenChange={() => setOpenStory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{openStory?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{openStory?.content}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
