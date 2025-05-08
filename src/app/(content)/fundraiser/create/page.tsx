"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { AlertCircle, X } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function CreateFundraiserPage() {
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    walletAddress: publicKey ? publicKey.toString() : "",
    category: "Medical",
  });

  useEffect(() => {
    if (!publicKey) {
      setFormData((prevData) => ({
        ...prevData,
        walletAddress: "",
      }));
    }

    if (publicKey) {
      setFormData((prevData) => ({
        ...prevData,
        walletAddress: publicKey.toString(),
      }));
    }
  }, [publicKey]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: "medical", name: "Medical", color: "bg-blue-100 text-blue-800" },
    { id: "family", name: "Family", color: "bg-green-100 text-green-800" },
    {
      id: "urgent-bill",
      name: "Urgent Bill",
      color: "bg-yellow-100 text-yellow-800",
    },
    { id: "crisis", name: "Crisis", color: "bg-red-100 text-red-800" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
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

  const removeImage = () => {
    setImagePreview(null);
  };

  const connectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletConnected = (address: string) => {
    setFormData({ ...formData, walletAddress: address });
    setIsWalletModalOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.goalAmount) {
      newErrors.goalAmount = "Goal amount is required";
    } else if (
      isNaN(Number(formData.goalAmount)) ||
      Number(formData.goalAmount) <= 0
    ) {
      newErrors.goalAmount = "Goal amount must be a positive number";
    }

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, this would submit to an API
      console.log("Form submitted:", { ...formData, image: imagePreview });

      // Redirect to a mock fundraiser page
      router.push("/fundraiser/new-fundraiser");
    }
  };

  // Mock wallet connection functionality
  const mockWalletConnect = () => {
    // Simulate wallet connection after a short delay
    setTimeout(() => {
      handleWalletConnected("8xDq9SWzUnpWzLNEh6vQnMzTCKHE3NwwcaL9oYJT7Ybj");
    }, 1000);
  };

  return (
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Emergency Medical Expenses for John"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`h-12 ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Story
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Explain your situation and why you need help..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Goal Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="goalAmount" className="text-base font-medium">
                  Goal Amount (USDC)
                </Label>
                <Input
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  placeholder="500"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  className={`h-12 ${errors.goalAmount ? "border-red-500" : ""}`}
                />
                {errors.goalAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goalAmount}
                  </p>
                )}
              </div>

              {/* Wallet Address Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="walletAddress"
                  className="text-base font-medium"
                >
                  Recipient Wallet Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    placeholder="Connect solana wallet address"
                    value={formData.walletAddress}
                    onChange={handleInputChange}
                    className={`h-12 flex-1 ${errors.walletAddress ? "border-red-500" : ""}`}
                    readOnly={!!formData.walletAddress}
                    disabled
                  />
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
                {errors.walletAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.walletAddress}
                  </p>
                )}
              </div>

              {/* Image Upload */}
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

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant={
                        formData.category === category.name
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer text-sm py-1 px-3 ${formData.category === category.name ? "bg-[#29339B]" : ""}`}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
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
                type="submit"
                className="w-full md:w-auto px-8 py-6 text-lg font-semibold bg-[#29339B] hover:bg-[#29339B/80] text-white rounded-xl"
              >
                Create Fundraiser
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Wallet Connect Dialog */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Connect your Solana wallet to receive funds
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={mockWalletConnect}
              className="flex items-center justify-center gap-2 bg-[#512da8] hover:bg-[#4527a0]"
            >
              <img
                src="https://phantom.app/img/phantom-logo.svg"
                alt="Phantom"
                className="w-5 h-5"
              />
              Connect Phantom
            </Button>
            <Button
              onClick={mockWalletConnect}
              className="flex items-center justify-center gap-2 bg-[#1e88e5] hover:bg-[#1976d2]"
            >
              <img
                src="https://backpack.app/favicon.ico"
                alt="Backpack"
                className="w-5 h-5"
              />
              Connect Backpack
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
