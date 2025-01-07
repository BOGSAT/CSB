import NavBar from "@/_components/NavBar";
import ProfileInfo from "@/_components/ProfileInfo";

import React from "react";

export default function page() {
  return (
    <div className="bg-black w-full h-screen">
      <div>
        <NavBar />
        <ProfileInfo />
      </div>
    </div>
  );
}
