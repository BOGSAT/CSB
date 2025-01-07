import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function StoryGrid() {
  return (
    <div className="w-full">
      {" "}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <Dialog>
                    <DialogTrigger>
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          This is the title of story {index + 1}
                        </DialogTitle>
                        <DialogDescription>
                          This will be the story content of story {index + 1}.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-2">
          <CarouselPrevious className="translate-y-0 relative " />
          <CarouselNext className=" translate-y-0 relative" />
        </div>
      </Carousel>
    </div>
  );
}

export default function StoryGridWrapper() {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-16 w-full max-w-6xl">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="">
            <StoryGrid />
          </div>
        ))}
      </div>
    </div>
  );
}
