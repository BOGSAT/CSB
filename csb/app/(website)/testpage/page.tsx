"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const { data: session } = useSession();
  useEffect(() => {
    console.log(session);
    if (!session) return;

    if (session?.customToken) {
      localStorage.setItem("token", session.customToken);
      localStorage.setItem("userId", session.userId);
      // localStorage.setItem("userId", session.user.id);
      router.push("/profile");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      router.push("/login");
    }
  }, [session]);

  return <div>Helloo</div>;
}
