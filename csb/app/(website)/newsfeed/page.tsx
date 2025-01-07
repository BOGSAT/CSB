import { BackgroundVideo } from "@/_components/BackgroundVideo";
import NavBar from "@/_components/NavBar";
import StoryGrid from "@/_components/StoryGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function page() {
  return (
    <div className="bg-black w-full h-screen">
      <div>
        <NavBar />
      </div>
      <div className="Seach mt-16 flex justify-center">
        <div className="flex justify-center w-96">
          <Input
            type="text"
            placeholder="Search"
            className="bg-black text-white"
          />
          <Button className={buttonVariants({ variant: "secondary" })}>
            Search
          </Button>
        </div>
      </div>
      <div className="Seach mt-4 flex justify-center">
        <Button>#Title</Button>
        <Button>#Author</Button>
        <Button>#Genre</Button>
        <Button>#Username</Button>
      </div>

      <div className="m-12 justify-center items-center grid px-6">
        <div className="flex grid-flow-col-4 gap-16">
          <StoryGrid />
          {/* <StoryGrid /> */}
        </div>
        <div className="flex grid-flow-col-4 gap-16">
          <StoryGrid />
          {/* <StoryGrid /> */}
        </div>
        <div className="flex grid-flow-col-4 gap-16">
          <StoryGrid />
          {/* <StoryGrid /> */}
        </div>
      </div>
    </div>
  );
}
