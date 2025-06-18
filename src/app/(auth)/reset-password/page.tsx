"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import apiRequest from "@/utils/apiRequest";
import AppInput from "@/components/customs/AppInput";
import { ValidationErrors } from "@/utils/type";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") as string;
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      router.push("/forgot-password");
    }
  }, [token, toast, router]);

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const errors = validateInputs({ newPassword, confirmPassword });

      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      const requiredFields = ["newPassword", "confirmPassword"];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        setIsLoading(false);
        return;
      }

      setError({});

      const payload = {
        token,
        newPassword: newPassword.trim(),
      };

      const res = await apiRequest("PATCH", "/password/reset", payload);

      if (res.success) {
        setSuccess(true);
        toast({
          title: "Success",
          description: "Your password has been reset successfully.",
        });
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: res.message || "Failed to reset password",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {success ? (
        <Card className="w-full max-w-md bg-primary border border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl justify-center items-center flex flex-col gap-2 font-bold text-center font-rajdhani text-primaryGold">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              Password Reset Complete
            </CardTitle>
            <CardDescription className="text-center text-[#ede4d3]">
              Your password has been reset successfully. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" disabled={true}>
                Redirecting to login...
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md bg-primary border border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center font-rajdhani text-primaryGold">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-center text-[#ede4d3]">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="flex items-center justify-between"
                >
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    New Password
                  </span>
                  {newPassword && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <AppInput
                  id="newPassword"
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={error.newPassword}
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
                  placeholder="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error.confirmPassword}
                />
              </div>

              <Button
                onClick={handleResetPassword}
                className="w-full"
                disabled={isLoading}
                variant={"secondary"}
              >
                {isLoading ? "Loading..." : "Reset Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPassword;
