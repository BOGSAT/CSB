"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Session } from "next-auth";

interface CustomSession extends Session {
  customToken?: string;
  userId?: string;
}

const formSchema = z
  .object({
    userName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { data: session } = useSession() as { data: CustomSession | null };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Register with NestJS backend
      const backendResponse = await fetch(
        "http://localhost:5001/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        setError(errorData.message || "Registration failed");
        return;
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/profile",
      });

      if (result?.error) {
        setError(result.error);
      } else {
        if (result?.ok && session?.customToken) {
          localStorage.setItem("token", session.customToken);
          localStorage.setItem("userId", session.userId || "");
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/profile",
      });

      // Check for session after Google sign-in
      if (result?.ok && session?.customToken) {
        localStorage.setItem("token", session.customToken);
        localStorage.setItem("userId", session.userId || "");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Google registration error:", error);
      setError("Google registration failed");
    }
  };

  useEffect(() => {
    if (session?.customToken) {
      localStorage.setItem("token", session.customToken);
      localStorage.setItem("userId", session.userId || "");
      router.push("/profile");
    }
  }, [session]);

  return (
    <div className="space-y-6 w-3/4">
      <h1
        className={`text-3xl text-center mb-8 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Your Ideas On Paper
      </h1>
      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className={theme === "dark" ? "text-white" : "text-gray-900"}>
          <Input
            className={`firstname mb-4 ${
              theme === "dark"
                ? "text-white bg-gray-800"
                : "text-gray-900 bg-white"
            } border-gray-300`}
            {...register("userName")}
            type="text"
            placeholder="Username"
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userName.message}
            </p>
          )}
        </div>

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

        <div>
          <Input
            className={`password mb-4 ${
              theme === "dark"
                ? "text-white bg-gray-800"
                : "text-gray-900 bg-white"
            } border-gray-300`}
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            type="submit"
            className={`${buttonVariants({ variant: "secondary" })} ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          <Button
            type="button"
            onClick={handleGoogleRegister}
            className={`${buttonVariants({ variant: "secondary" })} ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            Register with Google
          </Button>
        </div>
      </form>
    </div>
  );
};
