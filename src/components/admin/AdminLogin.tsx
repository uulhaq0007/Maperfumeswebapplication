import { useState } from "react";
import { LogIn, ArrowLeft } from "lucide-react@0.487.0";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner@2.0.3";
import { createClient } from "@supabase/supabase-js@2";
import {
  projectId,
  publicAnonKey,
} from "../../utils/supabase/info";
import type { Page } from "../../App";

interface AdminLoginProps {
  onLogin: (token: string) => void;
  onNavigate: (page: Page) => void;
}

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

export function AdminLogin({
  onLogin,
  onNavigate,
}: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        // Verify admin status
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/admin/verify`,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          },
        );

        if (response.ok) {
          toast.success("Login successful!");
          onLogin(data.session.access_token);
        } else {
          toast.error(
            "This account does not have admin access",
          );

          await supabase.auth.signOut();
        }
        onLogin(data.session.access_token);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.name
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/admin/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        },
      );

      if (response.ok) {
        toast.success("Admin account created! Please login.");
        setIsSignup(false);
        setFormData({
          email: formData.email,
          password: "",
          name: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "Failed to create account",
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl mb-2">
              {isSignup
                ? "Create Admin Account"
                : "Admin Login"}
            </h1>
            <p className="text-gray-600">
              {isSignup
                ? "Set up your admin account to manage the store"
                : "Sign in to access the admin dashboard"}
            </p>
          </div>

          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
              {isSignup && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignup
                ? "Already have an account? Sign in"
                : "Need an admin account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}