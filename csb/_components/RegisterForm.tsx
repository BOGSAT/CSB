"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React from "react";
import { loginWithGoogle } from "@/actions/auth";

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
      // Call your NestJS backend instead of NextAuth
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // Handle response
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google registration error:", error);
    }
  };

  return (
    <div className="space-y-6 w-3/4 text-white">
      <h1 className="text-white text-3xl text-center mb-8">
        Your Ideas On Paper
      </h1>
      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-white mb-4">
          <Input
            className="firstname mb-4 text-white"
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
            className="email mb-4 text-white"
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
            className="password mb-4 text-white"
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
            className="password mb-4 text-white"
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
            className={buttonVariants({ variant: "secondary" })}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          <Button
            type="button"
            onClick={handleGoogleRegister}
            className={buttonVariants({ variant: "secondary" })}
          >
            Register with Google
          </Button>
        </div>
      </form>
    </div>
  );
};
