import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link"; // Changed this import
import React from "react";

export default async function NavBar() {
  let data = await auth();
  console.log(data);

  return (
    <div className="bg-black w-full h-12">
      <div className="flex justify-between p-6">
        <Button className={buttonVariants({ variant: "secondary" })}>
          CSB Menu
        </Button>

        <Button className={buttonVariants({ variant: "secondary" })}>
          About CSB
        </Button>
        <div className="flex gap-6">
          <Button className={buttonVariants({ variant: "secondary" })}>
            Upgrade
          </Button>
          {data ? (
            <Link href="/profile">
              <Button className={buttonVariants({ variant: "destructive" })}>
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
