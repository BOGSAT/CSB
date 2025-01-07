import Footer from "@/_components/Footer";
import NavBar from "@/_components/NavBar";
import PricingPage from "@/_components/Pricing";
import React from "react";

export default function page() {
  return (
    <div className="bg-black w-full h-screen">
      <div>
        <NavBar />
      </div>
      <div className="">
        <PricingPage />
      </div>
    </div>
  );
}
