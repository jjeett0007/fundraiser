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
import apiRequest from "@/utils/apiRequest";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import { ValidationErrors } from "@/utils/type";
import { useToast } from "@/hooks/use-toast";

export default function VerifyAccount() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<ValidationErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("verificationEmail");
  //   if (!storedEmail) {
  //     router.push("/signup");
  //     return;
  //   }
  //   setEmail(storedEmail);
  // }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleVerifyAccount = async () => {
    try {
      const errors = validateInputs({
        code,
      });
      const requiredFields = ["code"];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        return;
      }

      setError({});
      setIsLoading(true);

      const payload = {
        otpCode: code,
      };

      const response = await apiRequest("POST", "/otp/verify", payload);

      if (response.status === 200) {
        localStorage.removeItem("verificationEmail");
        router.push("/dashboard");
        toast({
          title: "success",
          description: response.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError({});
    setResendDisabled(true);
    setCountdown(60);

    const payload = {
      email: email,
    };

    try {
      const response = await apiRequest("POST", "/otp/resend", payload);

      if (response.status === 200) {
        setCode("");
        toast({
          title: "success",
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
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleOTPChange = (value: string) => {
    setCode(value);
    setError({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-primary border border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center font-rajdhani text-primaryGold">
            Verify your account
          </CardTitle>
          <CardDescription className="text-center text-[#ede4d3]">
            Enter the 6-digit code sent to your email to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 items-center flex flex-col gap-2 justify-center">
              <div className="flex items-center justify-center gap-2 w-full">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleOTPChange}
                  id="otp-input"
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
              </div>

              {error && (
                <p className="text-xs text-center text-red-500 w-full">
                  {error.code}
                </p>
              )}
            </div>
            <Button
              onClick={handleVerifyAccount}
              className="w-full"
              disabled={isLoading}
              variant={"secondary"}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-[#ede4d3]">
            {`Didn't receive any code? `}
            <Button
              variant="link"
              className="p-0  font-rajdhani"
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
