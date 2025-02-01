"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import storydevImg from "/images/ScreenshotStorydev.png";
import profileImg from "/images/ScreenshotProfile.png";
import newsfeedImg from "/images/ScreenshotNewsfeed.png";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [storydevImg, profileImg, newsfeedImg];

export function CarouselComp() {
  return (
    <Carousel
      className="w-full h-full max-w-2xl"
      // plugins={[
      //   Autoplay({
      //     delay: 7000,
      //   }),
      // ]}
    >
      <CarouselContent>
        {images.map(
          (image, index) => (
            console.log("Image:", image, "Index:", index),
            (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        <Image
                          src={image.src}
                          alt={`Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          )
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
