"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

interface PricingPlan {
  title: string;
  price: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    title: "BookSmart",
    price: "€9,99",
    features: [
      "Image generation 15 a month",
      "Voice capabilities 30 min",
      "Download button",
    ],
  },
  {
    title: "BookSmart Plus",
    price: "€9,99",
    features: [
      "Image generation 30 a month",
      "Voice capabilities unlimited",
      "Download button",
    ],
  },
];

export default function PricingCards() {
  return (
    <div className="bg-black p-4 flex justify-center items-center">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.title}
            className="relative border-[#c1ff00] bg-black text-white"
          >
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">
                {plan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <span className="">{plan.price}</span>
                <span className=""> / month</span>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-center">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className={buttonVariants({ variant: "secondary" })}>
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
