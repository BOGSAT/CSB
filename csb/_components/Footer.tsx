import React from "react";

export default function Footer() {
  return (
    <div className="bg-black w-full h-3 flex justify-end items-end">
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 200"
        className="flex justify-end w-14 h-12"
      >
        <g fill="white">
          <text
            x="50"
            y="80"
            fontFamily="Arial Black, sans-serif"
            fontSize="40"
            fontWeight="bold"
          >
            COOL
          </text>
          <line
            x1="50"
            y1="90"
            x2="160"
            y2="90"
            stroke="white"
            strokeWidth="2"
          />

          <text
            x="100"
            y="130"
            fontFamily="Arial Black, sans-serif"
            fontSize="40"
            fontWeight="bold"
          >
            STORY
          </text>

          <text
            x="180"
            y="170"
            fontFamily="Arial Black, sans-serif"
            fontSize="40"
            fontWeight="bold"
          >
            BRO
          </text>
          <line
            x1="180"
            y1="180"
            x2="270"
            y2="180"
            stroke="white"
            strokeWidth="2"
          />

          <rect x="40" y="60" width="4" height="120" />
          <rect x="330" y="60" width="4" height="120" />
        </g>
      </svg>
    </div>
  );
}
