"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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

export default function CreateFundraiserPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [category, setCategory] = useState("Medical");
  const [walletAddress, setWalletAddress] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationErrors>({});
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const savedData = localStorage.getItem("fundraiserFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTitle(parsedData.title || "");
      setDescription(parsedData.description || "");
      setGoalAmount(parsedData.goalAmount || "");
      setCategory(parsedData.category || "Medical");
      setWalletAddress(parsedData.walletAddress || "");
      // setImagePreview(parsedData.imagePreview || null);
      setCurrentStep(parsedData.currentStep || 1);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const formData = {
        title,
        description,
        goalAmount,
        category,
        walletAddress,
        // imagePreview,
        currentStep,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("fundraiserFormData", JSON.stringify(formData));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    title,
    description,
    goalAmount,
    category,
    walletAddress,
    // imagePreview,
    currentStep,
  ]);

  const totalSteps = 4;

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress("");
    }
  }, [publicKey]);

  const toggleInfoExpanded = () => {
    setInfoExpanded(!infoExpanded);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const removeVideo = () => {
    setVideoPreview(null);
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (currentStep === 1) {
      const stepErrors = validateInputs({
        title,
        description,
        goalAmount,
      });

      if (stepErrors.title || stepErrors.description) {
        setError(stepErrors);
        return;
      }
    } else if (currentStep === 2) {
      const stepErrors = validateInputs({
        walletAddress,
      });

      if (stepErrors.walletAddress) {
        setError(stepErrors);
        return;
      }
    } else if (currentStep === 3) {
      if (!imagePreview) {
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

  const handleCreateFundraiser = async () => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("fundraiserFormData");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const errors = validateInputs({
        goalAmount,
        title,
        description,
        walletAddress,
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

      if (!imagePreview) {
        toast({
          title: "Image Required",
          description: "Please upload an image for your fundraiser",
          variant: "destructive",
        });
        return;
      }
      setError({});

      const payload = {
        title: title.trim(),
        description: description.trim(),
        goalAmount: Number(goalAmount),
        category: category.toLowerCase(),
        walletAddress: walletAddress.trim(),
        imageUrl:
          "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
        //  videoUrl: videoPreview,
      };

      const response = await apiRequest("POST", "/fundraise/create", payload);
      console.log(payload, response);
      if (response.success) {
        toast({
          title: "Success",
          description:
            response.message ||
            "Your fundraiser has been created successfully.",
        });
        setCurrentStep(4);
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

  const StepOne = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-sm font-medium text-primaryGold font-rajdhani"
        >
          Title
        </Label>
        <AppInput
          id="title"
          placeholder="E.g., Emergency Medical Expenses for John"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error.title}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-primaryGold font-rajdhani"
        >
          Story
        </Label>
        <AppTextarea
          id="description"
          placeholder="Explain your situation and why you need help..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error.description}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="goalAmount"
          className="text-sm font-medium text-primaryGold font-rajdhani"
        >
          Goal Amount (USDC)
        </Label>
        <AppInput
          id="goalAmount"
          type="number"
          placeholder="Min 150"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          error={error.goalAmount}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-primaryGold font-rajdhani">
          Category
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat.name === category;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => handleCategorySelect(cat.name)}
              >
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const StepTwo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="walletAddress"
          className="text-sm font-medium text-primaryGold font-rajdhani"
        >
          Recipient Wallet Address
        </Label>
        <div className="flex flex-col items-start gap-2">
          <AppInput
            id="walletAddress"
            placeholder="Connect solana wallet address"
            value={walletAddress || ""}
            onChange={(e) => setWalletAddress(e.target.value)}
            error={error.walletAddress}
            readOnly={!!walletAddress}
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
          <Shield className="h-4 w-4 mr-2" /> Why we need your wallet address
        </h3>
        <p className="text-white/80 text-sm">
          Your wallet address is where all donations will be sent directly. Make
          sure you have access to this wallet, as funds cannot be redirected
          once the fundraiser is live.
        </p>
      </div>
    </div>
  );

  const StepThree = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-primaryGold font-rajdhani">
          Image <span className="text-[#bd0e2b]">*</span>
        </Label>
        {!imagePreview ? (
          <div className="border-2 border-dashed border-[#f2bd74]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-[#f2bd74]/5 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
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
              <span className="text-xs text-[#bd0e2b] mt-1">Required</span>
            </label>
          </div>
        ) : (
          <div className="relative">
            <Image
              width={1000}
              height={1000}
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />

            <Button
              size={"icon"}
              onClick={removeImage}
              className="absolute top-2 right-2  rounded-full"
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
        {!videoPreview ? (
          <div className="border-2 border-dashed border-[#f2bd74]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-[#f2bd74]/5 transition-colors">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={handleVideoUpload}
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
            </label>
          </div>
        ) : (
          <div className="relative">
            <video
              src={videoPreview}
              controls
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              size={"icon"}
              onClick={removeVideo}
              className="absolute top-2 right-2  rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="bg-[#0a1a2f]/70 p-4 rounded-lg border border-[#f2bd74]/20 mt-6">
        <h3 className="text-[#f2bd74] font-medium mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" /> Media Guidelines
        </h3>
        <p className="text-white/80 text-sm">
          Images help donors connect with your cause. Choose clear, relevant
          images that represent your emergency situation. Videos can provide
          additional context and increase donation likelihood.
        </p>
      </div>
    </div>
  );

  const SuccessStep = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-[#f2bd74]" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-[#f2bd74]">
        Fundraiser Created!
      </h2>
      <p className="text-white/80 mb-8 max-w-md">
        Your emergency fundraiser has been created successfully. You can now
        verify and launch it from your dashboard.
      </p>
      <Button
        variant={"secondary"}
        onClick={() => {
          // router.push("/dashboard");
        }}
      >
        Verify
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <SuccessStep />;
      default:
        return <StepOne />;
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <FileText className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Basic Information",
          description:
            "Tell us about your emergency and what you're raising funds for. Be clear and specific to increase your chances of receiving help.",
        };
      case 2:
        return {
          icon: <Wallet className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Recipient Details",
          description:
            "Connect your wallet to receive funds directly. All donations will be sent to this address instantly without any delays.",
        };
      case 3:
        return {
          icon: <ImageIcon className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Media Upload",
          description:
            "Upload images and videos to help donors understand your situation better. A clear image is required for your fundraiser.",
        };
      case 4:
        return {
          icon: <CheckCircle className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Success",
          description:
            "Your fundraiser has been created and is ready for verification.",
        };
      default:
        return {
          icon: <FileText className="h-8 w-8 text-[#f2bd74] mb-4" />,
          title: "Basic Information",
          description:
            "Tell us about your emergency and what you're raising funds for.",
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 md:px-10 lg:px-14 relative z-10">
        <Card className="mx-auto shadow-lg bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#0a1a2f] to-[#0c2240] border-b border-[#f2bd74]/20 pb-6">
            <CardTitle className="md:text-2xl text-xl font-rajdhani font-bold text-[#f2bd74]">
              Create Emergency Fundraiser
            </CardTitle>
            <CardDescription className="text-[#ede4d3] mb-10">
              Set up your fundraiser quickly to receive immediate help
            </CardDescription>

            <div className="flex justify-between gap-2 md:gap-4 items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex gap-2  w-full items-center">
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
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 bg-[#0a1a2f]/80 border-b md:border-b-0 md:border-r border-[#f2bd74]/20">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer md:hidden border-b border-[#f2bd74]/20"
                  onClick={toggleInfoExpanded}
                >
                  <div className="flex items-center">
                    {stepInfo.icon && (
                      <div className="mr-3">
                        {React.cloneElement(
                          stepInfo.icon as React.ReactElement,
                          { className: "h-6 w-6 text-[#f2bd74]" }
                        )}
                      </div>
                    )}
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
                        Your fundraiser will be set up and available on your
                        dashboard, where you can launch it after verification.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-8">
                {renderStepContent()}
              </div>
            </div>
          </CardContent>

          {currentStep < 4 && (
            <CardFooter className="flex justify-between p-6 border-t border-[#f2bd74]/20">
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
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
