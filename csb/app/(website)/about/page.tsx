import NavBar from "@/_components/NavBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import React from "react";

export default function className() {
  return (
    <div className="bg-black w-full h-screen">
      <div className="text-white font-3xl">
        <NavBar />
      </div>
      <div className="flex justify-center items-center text-white font-3xl border-solid border-2 border-color-white m-32">
        <div className="grid grid-cols-2">
          <div className="flex justify-center items-center text-white font-3xl border-solid border-2 border-color-white m-32 p-6">
            About Cool Story Bro (CSB) <br />
            Welcome to Cool Story Bro, an innovative AI-powered brainstorming
            companion that helps transform your ideas into compelling stories.
            This platform was developed as a graduation project for the Codelabs
            Academy Full Stack Web Development Bootcamp, combining cutting-edge
            technology with creative storytelling.
            <br />
            <br />
            Technical Foundation Built with modern web technologies, CSB
            represents the culmination of full-stack development expertise:
            Frontend: Developed with Next.js, offering a smooth, responsive user
            experience with server-side rendering capabilities Backend: Powered
            by NestJS, providing a robust and scalable server architecture
            Database: MongoDB for flexible and efficient data storage AI
            Integration: OpenAI API for intelligent idea generation and
            refinement
            <br />
            <br />
          </div>
          <div className="flex justify-center items-center text-white font-3xl border-solid border-2 border-color-white m-32 p-6">
            What Makes CSB Special? <br />
            Cool Story Bro harnesses the power of artificial intelligence
            through OpenAI's API to assist users in developing and expanding
            their ideas. Whether you're a writer facing creative blocks, a
            professional preparing a presentation, or simply someone looking to
            explore new concepts, CSB provides an interactive and intuitive
            environment for brainstorming.
            <br />
            <br />
            Project Journey This application was born from the desire to make
            creative brainstorming more accessible and engaging. As a graduation
            project, it demonstrates the practical application of full-stack
            development skills while solving a real-world challenge: helping
            people generate and develop their ideas more effectively.
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
