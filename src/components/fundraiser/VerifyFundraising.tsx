"use client";

import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import apiRequest from "@/utils/apiRequest";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ID_VERIFICATION_OPTIONS } from "@/utils/list";
import AppInput from "../customs/AppInput";

const VerifyFundraising = () => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const [selectedIdType, setSelectedIdType] = useState<string>("");

  const removeImage = () => setImagePreview(null);
  const removeVideo = () => setVideoPreview(null);

  const handleUploadChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      if (!uploadResponse.success) throw new Error("Upload failed");

      type === "image"
        ? setImagePreview(uploadResponse.data)
        : setVideoPreview(uploadResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Upload failed: ${error}`,
        variant: "destructive",
      });
    } finally {
      type === "image" ? setImageLoading(false) : setVideoLoading(false);
    }
  };

  const handleVerify = () => {
    if (!selectedIdType || !idNumber || !imagePreview || !videoPreview) {
      toast({
        title: "Incomplete",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Submit logic here
    toast({
      title: "Submitted!",
      description:
        "Our team will validate your information within a few minutes",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary">Verify Identity</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[50%] max-w-[90%] lg:max-w-[40%] md:h-fit max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primaryGold font-rajdhani">
            Identity Verification
          </DialogTitle>
          <DialogDescription className="text-white/80">
            To ensure the legitimacy of your fundraiser, please provide:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>A government-issued ID</li>
              <li>Clear photo of your ID</li>
              <li>Short verification video</li>
            </ul>
            <p className="mt-2 text-sm text-primaryGold">
              Our team will validate your submission within a few minutes.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ID Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primaryGold font-rajdhani">
              ID Type <span className="text-[#bd0e2b]">*</span>
            </Label>
            <Select onValueChange={setSelectedIdType} value={selectedIdType}>
              <SelectTrigger>
                <SelectValue placeholder="Select ID type..." />
              </SelectTrigger>
              <SelectContent>
                {ID_VERIFICATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic ID Number Input */}
          {selectedIdType && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primaryGold font-rajdhani">
                {selectedIdType === "nin" && "NIN Number"}
                {selectedIdType === "driver_license" &&
                  "Driver's License Number"}
                {selectedIdType === "passport" && "Passport Number"}
                {selectedIdType === "voter_card" && "Voter's Card Number"}
                <span className="text-[#bd0e2b]">*</span>
              </Label>
              <AppInput
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={
                  selectedIdType === "nin"
                    ? "1234567890"
                    : selectedIdType === "passport"
                      ? "A12345678"
                      : "Enter ID number"
                }
              />
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primaryGold font-rajdhani">
              ID Photo <span className="text-[#bd0e2b]">*</span>
            </Label>
            {!imagePreview ? (
              <UploadArea
                id="image-upload"
                loading={imageLoading}
                onChange={(e) => handleUploadChange(e, "image")}
                type="image"
              />
            ) : (
              <PreviewWithRemove
                src={imagePreview}
                onRemove={removeImage}
                alt="ID Preview"
                isVideo={false}
              />
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primaryGold font-rajdhani">
              Verification Video <span className="text-[#bd0e2b]">*</span>
              <span className="block text-xs text-white/60 mt-1">
                (Hold your ID and state today's date)
              </span>
            </Label>
            {!videoPreview ? (
              <UploadArea
                id="video-upload"
                loading={videoLoading}
                onChange={(e) => handleUploadChange(e, "video")}
                type="video"
              />
            ) : (
              <PreviewWithRemove
                src={videoPreview}
                onRemove={removeVideo}
                alt="Video Preview"
                isVideo={true}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button onClick={() => setOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={
                !selectedIdType || !idNumber || !imagePreview || !videoPreview
              }
            >
              Submit Verification
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UploadArea = ({
  id,
  loading,
  onChange,
  type,
}: {
  id: string;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "image" | "video";
}) => (
  <div className="border-2 relative border-dashed border-[#f2bd74]/30 rounded-lg p-6 text-center cursor-pointer hover:bg-[#f2bd74]/5 transition-colors">
    {loading && (
      <div className="absolute border border-primaryGold w-6 h-6 top-2 bg-primary right-2 rounded-full">
        <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
      </div>
    )}
    <input
      type="file"
      id={id}
      accept={`${type}/*`}
      onChange={onChange}
      className="hidden"
    />
    <label
      htmlFor={id}
      className="cursor-pointer relative flex flex-col items-center"
    >
      <FiUploadCloud className="h-10 w-10 text-[#f2bd74] mb-2" />
      <span className="text-sm text-white/80">
        Click to upload {type === "image" ? "a photo" : "a video"}
      </span>
      <span className="text-xs text-[#bd0e2b] mt-1">Required</span>
    </label>
  </div>
);

const PreviewWithRemove = ({
  src,
  onRemove,
  alt,
  isVideo,
}: {
  src: string;
  onRemove: () => void;
  alt: string;
  isVideo: boolean;
}) => (
  <div className="relative">
    {isVideo ? (
      <video
        src={src}
        controls
        className="w-full h-48 object-cover rounded-lg"
      />
    ) : (
      <Image
        width={1000}
        height={1000}
        src={src}
        alt={alt}
        className="w-full h-48 object-cover rounded-lg"
      />
    )}
    <Button
      size="icon"
      onClick={onRemove}
      className="absolute top-2 right-2 rounded-full bg-red-500/90 hover:bg-red-500"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

export default VerifyFundraising;
