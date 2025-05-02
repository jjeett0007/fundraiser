"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiRequest from "@/utils/apiRequest";
import { EyeIcon, EyeOffIcon, CheckCircle2 } from "lucide-react";
import {
  validateEmail,
  validateRequired,
  validateForm,
} from "@/utils/formValidation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (email) {
      const timer = setTimeout(() => {
        const validation = validateEmail(email);
        setEmailError(validation.isValid ? "" : validation.message || "");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      const validation = validateRequired(password, "Password");
      setPasswordError(validation.isValid ? "" : validation.message || "");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailValidation = validateEmail(email);
    const passwordValidation = validateRequired(password, "Password");

    const formValidation = validateForm({
      email: emailValidation,
      password: passwordValidation,
    });

    if (!formValidation.isValid) {
      setEmailError(formValidation.errors.email || "");
      setPasswordError(formValidation.errors.password || "");

      setError(Object.values(formValidation.errors)[0]);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: email.trim(),
        password: password,
      };

      const response = await apiRequest("POST", "/auth/sign-in", payload);

      if (response.status === 203) {
        router.push("/verify-account");
        localStorage.setItem("verificationEmail", response.data.email);
        document.cookie = `Access=${
          response.data.token.access
        }; path=/; secure; max-age=${2 * 24 * 60 * 60}; samesite=strict`;
      } else {
        if (response.status === 200) {
          document.cookie = `Access=${
            response.data.token.access
          }; path=/; secure; max-age=${2 * 24 * 60 * 60}; samesite=strict`;

          const expirationInSeconds =
            Math.floor(Date.now() / 1000) + response.data.token.expiresIn;
          document.cookie = `expiresIn=${expirationInSeconds}; path=/; secure; max-age=${response.data.token.expiresIn}; samesite=strict`;

          router.push("/dashboard");

          // dispatch(
          //   setUser({
          //     id: res.data.id,
          //     email: res.data.email,
          //   })
          // );
          // dispatch(
          //   setToken({
          //     token: res.data.token?.access,
          //     expiresIn: res.data.token?.expiresIn,
          //   })
          // );
        } else {

          setError(response.message || "Invalid credentials");
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.message ||
          err?.message ||
          "Failed to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Login to EmergFund
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center justify-between"
              >
                <span>Email</span>
                {email && !emailError && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center">
                  <span>Password</span>
                  {password && !passwordError && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                  )}
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={passwordError ? "border-red-500" : ""}
                  placeholder="********"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !!emailError ||
                !!passwordError ||
                !email ||
                !password
              }
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
