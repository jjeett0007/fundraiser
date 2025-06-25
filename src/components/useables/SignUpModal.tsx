"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
// import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import Image from "next/image";
import google_logo from "@/assets/google_icon.svg";
import { ValidationErrors } from "@/utils/type";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import AppInput from "@/components/customs/AppInput";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setToken } from "@/store/slice/userTokenSlice";
import { Button } from "jet-packages";

const SignUpModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logged, setLogged] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.userToken.isAuthenticated
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<ValidationErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isAuthenticated || logged) {
      setIsVisible(false);
      return;
    }

    const modalClosed = sessionStorage.getItem("signupModalClosed");

    if (!modalClosed) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
    } else {
      const closedTime = parseInt(modalClosed);
      const currentTime = Date.now();
      const timePassed = currentTime - closedTime;
      const remainingTime = 30000 - timePassed;

      if (remainingTime <= 0) {
        setIsVisible(true);
        sessionStorage.removeItem("signupModalClosed");
      } else {
        timer = setTimeout(() => {
          setIsVisible(true);
          sessionStorage.removeItem("signupModalClosed");
        }, remainingTime);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, logged]);

  const handleSignup = async () => {
    try {
      const errors = validateInputs({
        email,
        password,
        firstName,
        lastName,
        confirmPassword,
      });

      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      const requiredFields = [
        "email",
        "password",
        "firstName",
        "lastName",
        "confirmPassword",
      ];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        return;
      }

      setError({});
      setIsLoading(true);

      const payload = {
        profileName: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
        email: email.trim(),
        password: password,
      };

      const response = await apiRequest("POST", "/auth/sign-up", payload);

      if (response.status === 201 || response.status === 200) {
        document.cookie = `Access=${
          response.data.token.access
        }; path=/; secure; max-age=${2 * 24 * 60 * 60}; samesite=strict`;

        const expirationInSeconds =
          Math.floor(Date.now() / 1000) + response.data.token.expiresIn;
        document.cookie = `expiresIn=${expirationInSeconds}; path=/; secure; max-age=${response.data.token.expiresIn}; samesite=strict`;

        dispatch(
          setToken({
            isAuthenticated: true,
          })
        );

        setLogged(true);

        setIsVisible(false);

        sessionStorage.removeItem("signupModalClosed");

        router.push("/verify-account");
        localStorage.setItem("verificationEmail", email.trim());
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
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

  const handleClose = () => {
    setIsVisible(false);

    sessionStorage.setItem("signupModalClosed", Date.now().toString());
  };

  if (!isVisible || isAuthenticated || logged) return null;

  return (
    <div className="fixed inset-0 z-[700] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-primary border border-white/20 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center font-rajdhani text-primaryGold">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-[#ede4d3]">
            Sign up to start creating and managing fundraisers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="flex items-center justify-between"
                >
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    First Name
                  </span>
                  {firstName && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <AppInput
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={error.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="flex items-center justify-between"
                >
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    Last Name
                  </span>
                  {lastName && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <AppInput
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={error.lastName}
                />
              </div>
            </div>
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
              <Label
                htmlFor="password"
                className="flex items-center justify-between"
              >
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  Password
                </span>
                {password && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <AppInput
                id="password"
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                error={error.password}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center justify-between"
              >
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  Confirm Password
                </span>
                {confirmPassword && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <AppInput
                id="confirmPassword"
                type={"password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                error={error.confirmPassword}
              />
            </div>
            <Button
              onClick={handleSignup}
              className="w-full"
              disabled={isLoading || googleLoading}
              variant={"secondary"}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
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
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#ede4d3]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primaryGold font-rajdhani hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpModal;
