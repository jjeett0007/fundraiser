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
import { setData } from "@/store/slice/userDataSlice";

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

          dispatch(
            setToken({
              token: response.data.token.access,
              expiresIn: response.data.token.expiresIn,
              isAuthenticated: true,
            })
          );

          const res = await apiRequest("GET", "/user");

          dispatch(
            setData({
              ...res.data,
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-primary border border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center font-rajdhani text-primaryGold">
            Login to EmergFund
          </CardTitle>
          <CardDescription className="text-center text-[#ede4d3]">
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
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  Email
                </span>
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
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    Password
                  </span>
                  {password && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                  )}
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm  font-rajdhani text-primaryGold hover:underline"
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
              disabled={isLoading || googleLoading}
              variant={"secondary"}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative w-full flex items-center justify-center py-4">
              <div className="border-b w-full border-[#60606093]"></div>
              <div className="absolute px-[1rem] bg-primary rounded-full border border-[#60606093] text-[13px] w-fit font-medium text-[#888]">
                OR
              </div>
            </div>
            <Button
              onClick={signInWithGoogle}
              disabled={googleLoading}
              variant="outline"
              className="py-5 hover:bg-primary/40 border-[#888] cursor-pointer w-full flex gap-2 items-center"
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
          <p className="text-sm text-[#ede4d3]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primaryGold font-rajdhani hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
