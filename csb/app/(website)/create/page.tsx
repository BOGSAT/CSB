import DevelopStoryForm from "@/_components/DevelopStoryForm";
import NavBar from "@/_components/NavBar";
import { Input } from "@/components/ui/input";
import React from "react";

export default function page() {
  return (
    <div className="bg-black w-full h-screen">
      <div className="text-white font-3xl">
        <NavBar />
      </div>
      <DevelopStoryForm />
    </div>
  );
}
