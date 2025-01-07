import React from "react";

interface BackgroundVideoProps {
  videoId: string;
  overlayOpacity?: number;
  children: React.ReactNode;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoId = "LjiHEZVquak",
  overlayOpacity = 50,
  children,
}) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="w-full h-full scale-150"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            pointerEvents: "none",
          }}
        />
      </div>
      <div className={`absolute inset-0 bg-black/${overlayOpacity}`} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
