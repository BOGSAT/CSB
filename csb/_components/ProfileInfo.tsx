"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StoryGridWrapper from "./StoryGrid";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "Jeroen van Rijsselt",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-3xl">Profile Information</h1>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-white hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="">
                <label className="text-sm  mb-1 block">Username</label>
                <Input
                  value={tempProfile.username}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, username: e.target.value })
                  }
                  className="w-full bg-white/10 border-white/20 text-black"
                />
              </div>
              <div className="">
                <label className="text-sm  mb-1 block">Bio</label>
                <Textarea
                  value={tempProfile.bio}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, bio: e.target.value })
                  }
                  className="w-full bg-white/10 border-white/20 text-black min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-white hover:bg-green-500/90"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">
                  Username
                </label>
                <p className="text-white text-lg">{profile.username}</p>
              </div>
              <div>
                <label className="text-sm text-white/70 mb-1 block">Bio</label>
                <p className="text-white">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-white text-3xl mb-6 text-center">
            Profile picture
          </h1>
          <div className="flex justify-center">
            <div className="w-24 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage className="" src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-6 mb-2" />
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        <StoryGridWrapper />
      </div>
    </div>
  );
}
