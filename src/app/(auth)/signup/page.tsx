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
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import apiRequest from "@/utils/apiRequest";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateForm,
} from "@/utils/formValidation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  useEffect(() => {
    if (firstName) {
      const validation = validateName(firstName, "First name");
      setFirstNameError(validation.isValid ? "" : validation.message || "");
    }
  }, [firstName]);

  useEffect(() => {
    if (lastName) {
      const validation = validateName(lastName, "Last name");
      setLastNameError(validation.isValid ? "" : validation.message || "");
    }
  }, [lastName]);

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
      const validation = validatePassword(password);
      setPasswordError(validation.isValid ? "" : validation.message || "");
      setPasswordStrength(validation.strength || null);

      if (confirmPassword) {
        const confirmValidation = validateConfirmPassword(
          password,
          confirmPassword
        );
        setConfirmPasswordError(
          confirmValidation.isValid ? "" : confirmValidation.message || ""
        );
      }
    } else {
      setPasswordStrength(null);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (confirmPassword) {
      const validation = validateConfirmPassword(password, confirmPassword);
      setConfirmPasswordError(
        validation.isValid ? "" : validation.message || ""
      );
    }
  }, [confirmPassword, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const firstNameValidation = validateName(firstName, "First name");
    const lastNameValidation = validateName(lastName, "Last name");
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      password,
      confirmPassword
    );

    const formValidation = validateForm({
      firstName: firstNameValidation,
      lastName: lastNameValidation,
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
    });

    if (!formValidation.isValid) {
      setFirstNameError(formValidation.errors.firstName || "");
      setLastNameError(formValidation.errors.lastName || "");
      setEmailError(formValidation.errors.email || "");
      setPasswordError(formValidation.errors.password || "");
      setConfirmPasswordError(formValidation.errors.confirmPassword || "");

      setError(Object.values(formValidation.errors)[0]);
      return;
    }

    setIsLoading(true);

    try {
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

        console.log(response);
        router.push("/verify-account");
        localStorage.setItem("verificationEmail", email.trim());
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(
        err?.response?.message || err?.message || "Failed to create account. Please try again."
      ); 
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "weak":
      default:
        return "bg-red-500";
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case "strong":
        return "w-full";
      case "medium":
        return "w-1/2";
      case "weak":
      default:
        return "w-1/4";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 md:px-10 lg:px-14">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to start creating and managing fundraisers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="flex items-center justify-between"
                >
                  <span>First Name</span>
                  {firstName && !firstNameError && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  className={firstNameError ? "border-red-500" : ""}
                />
                {firstNameError && (
                  <p className="text-xs text-red-500">{firstNameError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="flex items-center justify-between"
                >
                  <span>Last Name</span>
                  {lastName && !lastNameError && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  className={lastNameError ? "border-red-500" : ""}
                />
                {lastNameError && (
                  <p className="text-xs text-red-500">{lastNameError}</p>
                )}
              </div>
            </div>
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
              <Label
                htmlFor="password"
                className="flex items-center justify-between"
              >
                <span>Password</span>
                {password && !passwordError && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs">Password strength:</div>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getPasswordStrengthClass()}`}
                        style={{
                          width: passwordStrength
                            ? passwordStrength === "strong"
                              ? "100%"
                              : passwordStrength === "medium"
                                ? "50%"
                                : "25%"
                            : "0%",
                        }}
                      />
                    </div>
                    <div className="text-xs">
                      {passwordStrength === "strong" && "Strong"}
                      {passwordStrength === "medium" && "Medium"}
                      {passwordStrength === "weak" && "Weak"}
                    </div>
                  </div>
                </div>
              )}

              {passwordError ? (
                <p className="text-xs text-red-500">{passwordError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase,
                  lowercase, number, and special character
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center justify-between"
              >
                <span>Confirm Password</span>
                {confirmPassword && !confirmPasswordError && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={confirmPasswordError ? "border-red-500" : ""}
                  placeholder="********"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-red-500">{confirmPasswordError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !!firstNameError ||
                !!lastNameError ||
                !!emailError ||
                !!passwordError ||
                !!confirmPasswordError
              }
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
