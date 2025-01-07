import NavBar from "@/_components/NavBar";
import { CarouselComp } from "@/_components/CarouselComp";
import { RegisterForm } from "@/_components/RegisterForm";
import React from "react";

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="w-full h-full scale-150"
          src={`https://www.youtube.com/embed/LjiHEZVquak?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&playlist=LjiHEZVquak`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full">
        <div className="w-full h-screen">
          <NavBar />
          <div className="signincontainer grid grid-cols-2 grid-rows-1 gap-[5px] border-solid h-screen">
            <div className="left-side h-full flex justify-center items-center pb-60">
              <RegisterForm className="text-white" />
            </div>
            <div className="right-side h-full flex justify-center items-center pb-60">
              <div>
                <CarouselComp />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
