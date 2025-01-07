"use client";

import NavBar from "@/_components/NavBar";
import { Input } from "@/components/ui/input";
import { create } from "domain";
import React, { useState } from "react";

export default function page() {
  // const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
  const [message, setMessage] = useState("");

  const handleMessage = async () => {
    // const updatedMessages = [...message, { role: "user", content: message }];
    // setMessages(updatedMessages);
    // setMessage("");
    // const response = await create(updatedMessages).choices[0]?.message;
    // setMessages([...updatedMessages, response]);
  };
  return (
    <div className="bg-black w-full h-screen">
      <div className="text-white font-3xl">
        <NavBar />
      </div>
      <div className="h-screen flex items-center justify-center flex-col gap-10 container mx-auto pl-4 pt-6 pr-4">
        <Input
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setMessage("");
            }
          }}
          className="input input-bordered w-full m-10 border text-white"
        />
      </div>
    </div>
  );
}
