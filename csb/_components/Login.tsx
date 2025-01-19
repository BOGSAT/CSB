"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeProvider";

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Attempting login with:", data);

      const backendResponse = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Backend response status:", backendResponse.status);

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Login failed:", errorData);
        setError(errorData.message || "Login failed");
        return;
      }

      const responseData = await backendResponse.json();
      console.log("Login response data:", responseData);

      // debugger;
      // Store auth data

      localStorage.setItem("token", responseData.access_token.access_token);
      localStorage.setItem("userId", responseData.userId);

      console.log("Stored values:", {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
      });

      setTimeout(() => {
        window.location.href = "/profile";
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.setItem("authType", "google");

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/profile",
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        // Wait for session update
        await update();

        if (session?.customToken) {
          localStorage.setItem("token", session.customToken);
        }

        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed");
    }
  };

  return (
    <div className="space-y-6 w-1/2 ">
      <h1
        className={`text-3xl text-center mb-8 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Your Ideas On Paper
      </h1>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            className={`email mb-4 ${
              theme === "dark"
                ? "text-white bg-gray-800"
                : "text-gray-900 bg-white"
            } border-gray-300`}
            {...register("email")}
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            className={`password mb-4 ${
              theme === "dark"
                ? "text-white bg-gray-800"
                : "text-gray-900 bg-white"
            } border-gray-300`}
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className={`${buttonVariants({ variant: "secondary" })} ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            Login
          </Button>
        </div>
      </form>

      <div className="flex justify-center">
        <Button
          type="button"
          className={`${buttonVariants({ variant: "secondary" })} ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
};
