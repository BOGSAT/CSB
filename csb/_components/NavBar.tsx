"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check both NextAuth session and localStorage token
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token || !!session);
  }, [session]); // Add session as dependency

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    await signOut({ redirect: true, callbackUrl: "/login" }); // Use NextAuth signOut
  };

  return (
    <div
      className={`w-full h-12 ${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div className="flex justify-between p-6">
        <Button variant="secondary" onClick={() => router.push("/about")}>
          About CSB
        </Button>

        <div className="flex gap-6">
          <Button variant="secondary" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Button variant="secondary" onClick={() => router.push("/newsfeed")}>
            Newsfeed
          </Button>

          {isAuthenticated || status === "authenticated" ? ( // Check both
            <div className="flex gap-3">
              <Link href="/create">
                <Button variant="destructive">Create</Button>
              </Link>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              Login
            </Link>
          )}
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </div>
  );
}
