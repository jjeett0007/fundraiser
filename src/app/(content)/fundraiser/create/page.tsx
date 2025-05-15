"use client";

import React, { ChangeEvent, useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AlertCircle,
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Wallet,
  FileText,
  ImageIcon,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import AppInput from "@/components/customs/AppInput";
import AppTextarea from "@/components/customs/AppTextarea";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import { ValidationErrors } from "@/utils/type";
import { categories } from "@/utils/list";
import Image from "next/image";
import VerifyFundraising from "@/components/fundraiser/VerifyFundraising";

type FormData = {
  title: string;
  description: string;
  goalAmount: string;
  category: string;
  walletAddress: string;
  imagePreview: string | null;
  videoPreview: string | null;
};

export default function CreateFundraiserPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { toast } = useToast();

  const formSubmittedRef = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    goalAmount: "",
    category: "Medical",
    walletAddress: "",
    imagePreview: null,
    videoPreview: null,
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationErrors>({});
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fundRaiseId, setFundRaiseId] = useState("");

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!formSubmittedRef.current) {
      const savedData = localStorage.getItem("fundraiserFormData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));
          setCurrentStep(parsedData.currentStep || 1);
        } catch (e) {
          localStorage.removeItem("fundraiserFormData");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!formSubmittedRef.current) {
      const timer = setTimeout(() => {
        const dataToSave = {
          ...formData,
          currentStep,
        };
        localStorage.setItem("fundraiserFormData", JSON.stringify(dataToSave));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData, currentStep]);

  useEffect(() => {
    if (publicKey) {
      updateFormData("walletAddress", publicKey.toString());
    } else {
      updateFormData("walletAddress", "");
    }
  }, [publicKey]);

  const totalSteps = 4;

  const toggleInfoExpanded = () => {
    setInfoExpanded(!infoExpanded);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    updateFormData("category", selectedCategory);
  };

  const handleUploadChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({ description: "No file selected" });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    if (type === "video" && !file.type.includes("mp4")) {
      toast({
        title: "Invalid video format",
        description: "Please upload an MP4 video",
        variant: "destructive",
      });
      return;
    }

    if (
      type === "image" &&
      !["image/png", "image/jpeg", "image/gif"].includes(file.type)
    ) {
      toast({
        title: "Invalid image format",
        description: "Please upload a PNG, JPG, or GIF image",
        variant: "destructive",
      });
      return;
    }

    if (type === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";

      const videoDuration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
      });

      if (videoDuration > 300) {
        toast({
          title: "Video too long",
          description: "Please select a video shorter than 5 minutes",
          variant: "destructive",
        });
        return;
      }
    }

    type === "image" ? setImageLoading(true) : setVideoLoading(true);

    try {
      const base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const uploadResponse = await apiRequest("POST", "/upload/file", {
        file: base64String,
      });

      if (!uploadResponse.success) {
        throw new Error("Failed to upload");
      }
      updateFormData(
        type === "image" ? "imagePreview" : "videoPreview",
        uploadResponse.data.link
      );
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}, Try again`,
        variant: "destructive",
      });
    } finally {
      type === "image" ? setImageLoading(false) : setVideoLoading(false);
    }
  };

  const removeImage = () => {
    updateFormData("imagePreview", null);
  };

  const removeVideo = () => {
    updateFormData("videoPreview", null);
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (currentStep === 1) {
      const stepErrors = validateInputs({
        title: formData.title,
        description: formData.description,
        goalAmount: formData.goalAmount,
      });

      if (stepErrors.title || stepErrors.description) {
        setError(stepErrors);
        return;
      }
    } else if (currentStep === 2) {
      const stepErrors = validateInputs({
        walletAddress: formData.walletAddress,
      });

      if (stepErrors.walletAddress) {
        setError(stepErrors);
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.imagePreview) {
        toast({
          title: "Image Required",
          description: "Please upload an image for your fundraiser",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setError({});
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError({});
  };

  const clearFormData = () => {
    formSubmittedRef.current = true;

    localStorage.removeItem("fundraiserFormData");

    setFormData({
      title: "",
      description: "",
      goalAmount: "",
      category: "Medical",
      walletAddress: publicKey ? publicKey.toString() : "",
      imagePreview: null,
      videoPreview: null,
    });
  };

  const handleCreateFundraiser = async () => {
    setIsLoading(true);

    try {
      const errors = validateInputs({
        goalAmount: formData.goalAmount,
        title: formData.title,
        description: formData.description,
        walletAddress: formData.walletAddress,
      });

      const requiredFields = [
        "goalAmount",
        "title",
        "description",
        "walletAddress",
      ];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        setIsLoading(false);
        return;
      }

      if (!formData.imagePreview) {
        toast({
          title: "Image Required",
          description: "Please upload an image for your fundraiser",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: Number(formData.goalAmount),
        category: formData.category.toLowerCase(),
        walletAddress: formData.walletAddress.trim(),
        imageUrl: formData.imagePreview,
        videoUrl: formData.videoPreview || "",
      };

      const response = await apiRequest("POST", "/fundraise/create", payload);

      if (response.success) {
        clearFormData();
        toast({
          title: "Success",
          description: response.message || "Fundraiser created successfully",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setFundRaiseId(response.data.fundRaiseId);
        setCurrentStep(4);

        console.log(fundRaiseId);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to create fundraiser",
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

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <FileText className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Basic Information",
          description:
            "Tell us about your emergency and what you're raising funds for.",
        };
      case 2:
        return {
          icon: <Wallet className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Recipient Details",
          description: "Connect your wallet to receive funds directly.",
        };
      case 3:
        return {
          icon: <ImageIcon className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Media Upload",
          description:
            "Upload images and videos to help donors understand your situation.",
        };
      case 4:
        return {
          icon: <CheckCircle className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Success",
          description: "Your fundraiser has been created successfully.",
        };
      default:
        return {
          icon: <FileText className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Basic Information",
          description: "Tell us about your emergency.",
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 md:px-10 lg:px-14 relative z-10">
        <div className="mx-auto rounded-lg shadow-lg bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
          <div className="bg-gradient-to-r from-[#0a1a2f] to-[#0c2240] border-b border-[#f2bd74]/20 p-6">
            <div className="md:text-2xl text-xl font-rajdhani font-bold text-[#f2bd74]">
              Create Emergency Fundraiser
            </div>
            <div className="text-[#ede4d3] mb-10">
              Set up your fundraiser quickly to receive immediate help
            </div>

            <div className="flex justify-between gap-2 md:gap-4 items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex gap-2 w-full items-center">
                  <div
                    className={`w-8 h-8 rounded-full px-3 flex items-center justify-center ${
                      step === currentStep
                        ? "bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] text-white"
                        : step < currentStep
                          ? "bg-[#f2bd74] text-[#0a1a2f]"
                          : "bg-[#0a1a2f] border border-[#f2bd74]/30 text-[#f2bd74]/50"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-5 w-6" />
                    ) : (
                      <>{step === 4 ? "🎉" : step}</>
                    )}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-full h-0.5 rounded-full ${
                        step < currentStep ? "bg-[#f2bd74]" : "bg-[#ede4d35a]"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 bg-[#0a1a2f]/80 border-b md:border-b-0 md:border-r border-[#f2bd74]/20">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer md:hidden border-b border-[#f2bd74]/20"
                  onClick={toggleInfoExpanded}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {React.cloneElement(stepInfo.icon as React.ReactElement, {
                        className: "h-6 w-6 text-[#f2bd74]",
                      })}
                    </div>
                    <h2 className="font-rajdhani font-bold text-[#f2bd74]">
                      {stepInfo.title}
                    </h2>
                  </div>
                  {infoExpanded ? (
                    <ChevronUp className="h-5 w-5 text-[#f2bd74]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#f2bd74]" />
                  )}
                </div>

                <div
                  className={`${infoExpanded ? "block" : "hidden"} md:block p-6 md:p-8`}
                >
                  <div className="hidden md:block">{stepInfo.icon}</div>
                  <h2 className="text-xl font-rajdhani font-bold mb-3 text-[#f2bd74] hidden md:block">
                    {stepInfo.title}
                  </h2>
                  <p className="text-white/70">{stepInfo.description}</p>

                  {currentStep < 4 && (
                    <div className="bg-[#0a1a2f]/70 p-4 rounded-lg border border-[#f2bd74]/20 mt-8">
                      <h3 className="text-[#f2bd74] font-rajdhani font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" /> Important
                      </h3>
                      <p className="text-white/80 text-sm">
                        Your fundraiser will be available on your dashboard
                        after creation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-8">
                {/* Step 1 - Basic Information */}
                <div
                  className="space-y-6"
                  style={{
                    display: currentStep === 1 ? "block" : "none",
                    position: currentStep === 1 ? "relative" : "absolute",
                    visibility: currentStep === 1 ? "visible" : "hidden",
                    width: "100%",
                  }}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Title
                    </Label>
                    <AppInput
                      id="title"
                      type="text"
                      placeholder="E.g., Emergency Medical Expenses for John"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      error={error.title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Story
                    </Label>
                    <AppTextarea
                      id="description"
                      placeholder="Explain your situation..."
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      error={error.description}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Goal Amount (USDC)
                    </Label>
                    <AppInput
                      id="goalAmount"
                      type="number"
                      placeholder="Min 1USDC"
                      value={formData.goalAmount}
                      onChange={(e) =>
                        updateFormData("goalAmount", e.target.value)
                      }
                      error={error.goalAmount}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Category
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat.id}
                          variant={
                            cat.name === formData.category
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleCategorySelect(cat.name)}
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 2 - Recipient Details */}
                <div
                  className="space-y-6"
                  style={{
                    display: currentStep === 2 ? "block" : "none",
                    position: currentStep === 2 ? "relative" : "absolute",
                    visibility: currentStep === 2 ? "visible" : "hidden",
                    width: "100%",
                  }}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Recipient Wallet Address
                    </Label>
                    <div className="flex flex-col items-start gap-2">
                      <AppInput
                        id="walletAddress"
                        placeholder="Connect solana wallet address"
                        value={formData.walletAddress}
                        onChange={(e) =>
                          updateFormData("walletAddress", e.target.value)
                        }
                        error={error.walletAddress}
                        readOnly={!!formData.walletAddress}
                      />
                      <WalletMultiButton
                        style={{
                          background: "#0a1a2f",
                          color: "#f2bd74",
                          border: "1px solid #f2bd74",
                          padding: "0px 15px",
                          borderRadius: "0.5rem",
                          fontSize: "14px",
                          margin: 0,
                          display: "inline-flex",
                          width: "100%",
                          flex: "1",
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#0a1a2f]/70 p-4 rounded-lg border border-[#f2bd74]/20 mt-6">
                    <h3 className="text-[#f2bd74] font-rajdhani font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2" /> Why we need your
                      wallet address
                    </h3>
                    <p className="text-white/80 text-sm">
                      Your wallet address is where all donations will be sent
                      directly.
                    </p>
                  </div>
                </div>

                {/* Step 3 - Media Upload */}
                <div
                  className="space-y-6"
                  style={{
                    display: currentStep === 3 ? "block" : "none",
                    position: currentStep === 3 ? "relative" : "absolute",
                    visibility: currentStep === 3 ? "visible" : "hidden",
                    width: "100%",
                  }}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Image <span className="text-[#bd0e2b]">*</span>
                    </Label>
                    {!formData.imagePreview ? (
                      <div className="border-2 border-dashed relative border-[#f2bd74]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-[#f2bd74]/5 transition-colors">
                        {imageLoading && (
                          <div className="absolute flex items-center justify-center w-6 h-6 border border-primaryGold top-2 bg-primary right-2 rounded-full">
                            <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
                          </div>
                        )}
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={(e) => handleUploadChange(e, "image")}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FiUploadCloud className="h-10 w-10 text-[#f2bd74] mb-2" />
                          <span className="text-sm text-white/80">
                            Click to upload an image
                          </span>
                          <span className="text-xs text-[#bd0e2b] mt-1">
                            Required
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <Image
                          width={1000}
                          height={1000}
                          src={formData.imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover border border-white/20 rounded-lg"
                        />
                        <Button
                          size={"icon"}
                          onClick={removeImage}
                          className="absolute top-2 right-2 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                      Video (Optional)
                    </Label>
                    {!formData.videoPreview ? (
                      <div className="border-2 relative border-dashed border-[#f2bd74]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-[#f2bd74]/5 transition-colors">
                        {videoLoading && (
                          <div className="absolute flex items-center justify-center border border-primaryGold w-6 h-6 top-2 bg-primary right-2 rounded-full">
                            <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
                          </div>
                        )}
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/mp4"
                          onChange={(e) => handleUploadChange(e, "video")}
                          className="hidden"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FiUploadCloud className="h-10 w-10 text-[#f2bd74] mb-2" />
                          <span className="text-sm text-white/80">
                            Click to upload a video
                          </span>
                          <span className="text-xs text-[#bd0e2b] mt-1">
                            Max Length: 5min
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          src={formData.videoPreview}
                          controls
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          size={"icon"}
                          onClick={removeVideo}
                          className="absolute top-2 right-2 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4 - Success */}
                <div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  style={{
                    display: currentStep === 4 ? "flex" : "none",
                    position: currentStep === 4 ? "relative" : "absolute",
                    visibility: currentStep === 4 ? "visible" : "hidden",
                    width: "100%",
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-[#f2bd74]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-[#f2bd74]">
                    Fundraiser Created!
                  </h2>
                  <p className="text-white/80 mb-8 max-w-md">
                    Your emergency fundraiser has been created successfully.
                  </p>
                  <div>
                    <VerifyFundraising fundRaiseId={fundRaiseId} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentStep < 4 && (
            <div className="flex justify-between p-6 border-t border-[#f2bd74]/20">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className={`${
                  currentStep === 1 ? "invisible" : ""
                } border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={isLoading}
                  variant={"secondary"}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateFundraiser}
                  disabled={isLoading}
                  variant={"secondary"}
                >
                  {isLoading ? "Creating..." : "Create Fundraiser"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
