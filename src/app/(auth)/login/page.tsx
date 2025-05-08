"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiRequest from "@/utils/apiRequest";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import Image from "next/image";
import google_logo from "@/assets/google_icon.svg";
import AppInput from "@/components/customs/AppInput";
import { ValidationErrors } from "@/utils/type";
import { useToast } from "@/hooks/use-toast";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import { setToken } from "@/store/slice/userTokenSlice";
import { useAppDispatch } from "@/store/hooks";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ValidationErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const errors = validateInputs({
        email,
        password,
      });
      const requiredFields = ["email", "password"];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        return;
      }

      setError({});
      setIsLoading(true);

      const payload = {
        email: email.trim(),
        password: password,
      };

      const response = await apiRequest("POST", "/auth/sign-in", payload);

      if (response.status === 203) {
        router.push("/verify-account");
        localStorage.setItem("verificationEmail", response.data.email);
        document.cookie = `Access=${response.data.token.access
          }; path=/; secure; max-age=${2 * 24 * 60 * 60}; samesite=strict`;
      } else {
        if (response.status === 200) {
          document.cookie = `Access=${response.data.token.access
            }; path=/; secure; max-age=${2 * 24 * 60 * 60}; samesite=strict`;

          const expirationInSeconds =
            Math.floor(Date.now() / 1000) + response.data.token.expiresIn;
          document.cookie = `expiresIn=${expirationInSeconds}; path=/; secure; max-age=${response.data.token.expiresIn}; samesite=strict`;

          dispatch(
            setToken({
              token: response.data.token.access,
              expiresIn: response.data.token.expiresIn,
              isAuthenticated: true,
            })
          );
          router.push("/dashboard");
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      setIsLoading(false);

      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setGoogleLoading(true);
    window.location.href = "/api/google";
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center justify-between"
              >
                <span>Email</span>
                {email && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </Label>
              <AppInput
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.email}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center">
                  <span>Password</span>
                  {password && (
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
              <AppInput
                id="password"
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                error={error.password}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative w-full flex items-center justify-center py-4">
              <div className="border-b w-full border-[#ccc]"></div>
              <div className="absolute px-[1rem] bg-white text-[14px] w-fit font-medium text-[#888]">
                OR
              </div>
            </div>
            <Button
              onClick={signInWithGoogle}
              disabled={googleLoading}
              variant="outline"
              className="py-5 hover:bg-[#e6c0ff4a] border-[#888] cursor-pointer w-full flex gap-2 items-center"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={google_logo}
                  height={1000}
                  width={1000}
                  className="w-8 object-cover"
                  alt="google"
                />
                {googleLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Redirecting...
                  </>
                ) : (
                  <>Continue with Google</>
                )}
              </div>
            </Button>
          </div>
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
