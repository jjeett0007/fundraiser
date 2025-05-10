"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import AppInput from "@/components/customs/AppInput";
import AppTextarea from "@/components/customs/AppTextarea";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import { ValidationErrors } from "@/utils/type";
import { categories } from "@/utils/list";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress("");
    }
  }, [publicKey]);

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

  const SuccessDialog = () => {
    return (
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="text-green-600 h-8 w-8" />
            </div>
            <DialogTitle className="text-center text-xl">Success!</DialogTitle>
            <DialogDescription className="text-center">
              Your fundraiser has been created successfully. You can view and
              launch it on your dashboard.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  const handleCreateFundraiser = async (): Promise<void> => {
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

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        goalAmount: Number(goalAmount),
        category: category.toLowerCase(),
        walletAddress: walletAddress.trim(),
        imageUrl:
          "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
        // videoUrl: videoUrl,
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
        setShowSuccessModal(true);

        // router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to create fundraiser",
        });
        setIsLoading(false);
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
    <>
      <SuccessDialog />
      <div className="container mx-auto px-4 py-8 bg-gray-50 md:px-10 lg:px-14">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-[#29339B] text-white rounded-t-xl">
            <CardTitle className="text-2xl font-bold">
              Create Emergency Fundraiser
            </CardTitle>
            <CardDescription className="text-gray-100">
              Set up your fundraiser quickly to receive immediate help
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <AppInput
                  id="title"
                  name="title"
                  placeholder="E.g., Emergency Medical Expenses for John"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={error.title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Story
                </Label>
                <AppTextarea
                  id="description"
                  name="description"
                  placeholder="Explain your situation and why you need help..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalAmount" className="text-base font-medium">
                  Goal Amount (USDC)
                </Label>
                <AppInput
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  placeholder="500"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  error={error.goalAmount}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="walletAddress"
                  className="text-base font-medium"
                >
                  Recipient Wallet Address
                </Label>
                <div className="flex items-center gap-2">
                  <AppInput
                    id="walletAddress"
                    name="walletAddress"
                    placeholder="Connect solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    error={error.walletAddress}
                    readOnly={!!walletAddress}
                    disabled
                  />

                  <div className="flex-1">
                    <WalletMultiButton
                      style={{
                        padding: "15px",
                        paddingTop: "1px",
                        paddingBottom: "1px",
                        fontSize: "12px",
                        margin: 0,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Image (Optional)
                </Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
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
                      <FiUploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload an image
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Video (Optional)
                </Label>
                {!videoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
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
                      <FiUploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
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
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isActive = cat.name === category;
                    return (
                      <Badge
                        key={cat.id}
                        variant={isActive ? "default" : "outline"}
                        className={
                          isActive
                            ? `${cat.bgColor} ${cat.textColor} cursor-pointer`
                            : `border ${cat.textColor} hover:${cat.bgColor} cursor-pointer`
                        }
                        onClick={() => handleCategorySelect(cat.name)}
                      >
                        {cat.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="bg-yellow-50 items-center p-2 gap-2 flex border border-yellow-500 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <div className="text-yellow-800 text-sm">
                  Your fundraiser will be set up and available on your
                  dashboard, where you can launch it.
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-center pt-6 pb-2 px-0">
              <Button
                onClick={handleCreateFundraiser}
                disabled={isLoading}
                size={"lg"}
              >
                {isLoading ? "Creating..." : "Create Fundraiser"}
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
