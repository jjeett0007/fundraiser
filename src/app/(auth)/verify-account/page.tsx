"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { validateOTP } from "@/utils/formValidation";
import { CheckCircle2 } from "lucide-react";

export default function VerifyAccount() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage when component mounts
    const storedEmail = localStorage.getItem("verificationEmail");
    if (!storedEmail) {
      // If no email found, redirect back to signup
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (code) {
      const validation = validateOTP(code);
      setOtpError(validation.isValid ? "" : validation.message || "");
      setIsValid(validation.isValid);
    } else {
      setOtpError("");
      setIsValid(false);
    }
  }, [code]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpValidation = validateOTP(code);

    if (!otpValidation.isValid) {
      setOtpError(otpValidation.message || "Invalid verification code");
      setError(
        otpValidation.message || "Please enter a valid verification code"
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        otpCode: code,
      };

      const response = await apiRequest("POST", "/otp/verify", payload);

      if (response.status === 200) {
        localStorage.removeItem("verificationEmail");
        router.push("/dashboard");
      } else {
        setError(response.message || "Invalid verification code");
      }
    } catch (err: any) {
      setError(
        err.response.message || "Failed to verify account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setResendDisabled(true);
    setCountdown(60);

    const payload = {
      email: email,
    };

    try {
      const response = await apiRequest("POST", "/otp/resend", payload);

      if (response.status === 200) {
        setCode("");
        setOtpError("");
        setIsValid(false);
      } else {
        setError(response.message || "Failed to resend verification code");
      }
    } catch (err: any) {
      setError(
        err.response.message ||
          "Failed to resend verification code. Please try again later."
      );
    }
  };

  const handleOTPChange = (value: string) => {
    setCode(value);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Verify your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 items-center flex flex-col gap-2 justify-center">
              <div className="flex items-center justify-center gap-2 w-full">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleOTPChange}
                  id="otp-input"
                  className={otpError ? "border-red-500" : ""}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {isValid && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>

              {otpError && (
                <p className="text-xs text-center text-red-500 w-full">{otpError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600">
            {`Didn't receive any code? `}
            <Button
              variant="link"
              className="p-0"
              disabled={resendDisabled}
              onClick={handleResendCode}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
            </Button>
          </p>
          <p className="text-xs text-gray-500 text-center">
            Please check your inbox and spam folder for the verification email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
