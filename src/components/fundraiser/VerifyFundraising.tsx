"use client";

import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import { ID_VERIFICATION_OPTIONS } from "@/utils/list";
import { Loader2, X, Plus, FileText } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import Image from "next/image";
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
import AppInput from "../customs/AppInput";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ProofFile = {
  type: string;
  file: string;
};

type DocumentData = {
  frontView: string;
  backView: string;
};

const VerifyFundraising = ({
  onVerified,
  fundRaiseId,
}: {
  onVerified?: () => void;
  fundRaiseId: string;
}) => {
  const { toast } = useToast();
  const userData = useSelector((state: RootState) => state.userData);
  const country = userData.address?.country || "";

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selfie, setSelfie] = useState("");
  const [livenessVideo, setLivenessVideo] = useState("");
  const [documentData, setDocumentData] = useState<DocumentData>({
    frontView: "",
    backView: "",
  });
  const [fundRaiseProofs, setFundRaiseProofs] = useState<ProofFile[]>([]);
  const [idOptions, setIdOptions] = useState(ID_VERIFICATION_OPTIONS);

  // Loading states grouped together
  const [loadingStates, setLoadingStates] = useState({
    selfie: false,
    livenessVideo: false,
    frontView: false,
    backView: false,
    proof: false,
  });

  // Memoize the ID options based on country
  useEffect(() => {
    const isNigeria = country.toLowerCase() === "nigeria";
    setIdOptions(
      isNigeria
        ? ID_VERIFICATION_OPTIONS
        : ID_VERIFICATION_OPTIONS.filter((opt) => opt.value !== "nin")
    );
  }, [country]);

  // Optimized file upload handler
  const handleFileUpload = useCallback(
    async (
      e: ChangeEvent<HTMLInputElement>,
      type: "image" | "video" | "pdf",
      field: keyof typeof loadingStates
    ) => {
      const file = e.target.files?.[0];
      if (!file) {
        toast({ description: "No file selected" });
        return;
      }

      // Validate file
      const maxSize = type === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `Please select a file smaller than ${type === "video" ? "50MB" : "5MB"}`,
          variant: "destructive",
        });
        return;
      }

      if (type === "pdf" && !file.type.includes("pdf")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }

      // Set loading state
      setLoadingStates((prev) => ({ ...prev, [field]: true }));

      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        const uploadResponse = await apiRequest("POST", "/upload/file", {
          file: base64String,
        });

        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || "Upload failed");
        }

        switch (field) {
          case "selfie":
            setSelfie(uploadResponse.data.link);
            break;
          case "livenessVideo":
            setLivenessVideo(uploadResponse.data.link);
            break;
          case "frontView":
            setDocumentData((prev) => ({
              ...prev,
              frontView: uploadResponse.data.link,
            }));
            break;
          case "backView":
            setDocumentData((prev) => ({
              ...prev,
              backView: uploadResponse.data.link,
            }));
            break;
          case "proof":
            setFundRaiseProofs((prev) => [
              ...prev,
              {
                type: uploadResponse.data.type,
                file: uploadResponse.data.link,
              },
            ]);
            break;
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Upload failed",
          variant: "destructive",
        });
        if (e.target) e.target.value = "";
      } finally {
        setLoadingStates((prev) => ({ ...prev, [field]: false }));
      }
    },
    [toast]
  );

  const removeFile = useCallback((field: string, index?: number) => {
    switch (field) {
      case "selfie":
        setSelfie("");
        break;
      case "livenessVideo":
        setLivenessVideo("");
        break;
      case "frontView":
        setDocumentData((prev) => ({ ...prev, frontView: "" }));
        break;
      case "backView":
        setDocumentData((prev) => ({ ...prev, backView: "" }));
        break;
      case "proof":
        if (index !== undefined) {
          setFundRaiseProofs((prev) => prev.filter((_, i) => i !== index));
        }
        break;
    }
  }, []);

  const handleSubmitVerification = useCallback(async () => {
    if (
      !selectedIdType ||
      !idNumber ||
      !selfie ||
      // !livenessVideo ||
      !documentData.frontView ||
      !mobileNumber
    ) {
      toast({
        title: "Incomplete",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest(
        "POST",
        `/fundraise/verify/${fundRaiseId}`,
        {
          country,
          meansOfVerification: selectedIdType,
          selfie,
          // livenessVideo,
          documentData,
          idNumber,
          mobileNumber,
          fundRaiseProofs:
            fundRaiseProofs.length > 0 ? fundRaiseProofs : undefined,
        }
      );

      if (response.success) {
        toast({
          title: "Success",
          description:
            response.message || "Verification submitted successfully!",
        });
        setOpen(false);
        onVerified?.();
      } else {
        throw new Error(response.message || "Verification failed!");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verification failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedIdType,
    idNumber,
    selfie,
    // livenessVideo,
    documentData,
    mobileNumber,
    fundRaiseProofs,
    fundRaiseId,
    country,
    toast,
    onVerified,
  ]);

  // Get placeholder text for ID number input
  const idPlaceholder = useCallback(() => {
    switch (selectedIdType) {
      case "nin":
        return "12345678901";
      case "passport":
        return "A12345678";
      case "driver_license":
        return "DL12345678";
      case "voter_card":
        return "VC12345678";
      default:
        return "Enter ID number";
    }
  }, [selectedIdType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Verify Fundraiser</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[80%] max-w-[100%] lg:max-w-[60%] md:h-fit max-h-[100dvh] overflow-y-auto">
        <DialogHeader className="space-y-2 items-start flex flex-col">
          <DialogTitle className="text-primaryGold font-rajdhani">
            Fundraiser Verification
          </DialogTitle>
          <DialogDescription className="text-white/80 text-left">
            To ensure the legitimacy of your fundraiser, please provide the
            following documents:
            <ul className="list-disc items-start flex flex-col pl-5 mt-2 space-y-1">
              <li>Government-issued ID</li>
              <li>Selfie with your ID</li>
              <li>Liveness verification video</li>
              <li>Supporting documents for your fundraiser</li>
            </ul>
            <p className="mt-2 text-sm text-left text-primaryGold">
              Our team will validate your submission within 24 hours.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h3 className="text-primaryGold font-rajdhani font-medium">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white font-medium">
                  Country
                </Label>
                <AppInput value={country} disabled className="bg-white/10" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-white font-medium ">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <AppInput
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* ID Verification */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h3 className="text-primaryGold font-rajdhani font-medium">
              ID Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white">
                  ID Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={setSelectedIdType}
                  value={selectedIdType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {idOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-white font-medium ">
                  {selectedIdType === "nin"
                    ? "NIN Number"
                    : selectedIdType === "passport"
                      ? "Passport Number"
                      : selectedIdType === "driver_license"
                        ? "Driver's License"
                        : selectedIdType === "voter_card"
                          ? "Voter's Card"
                          : "ID Number"}
                  <span className="text-red-500">*</span>
                </Label>
                <AppInput
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={idPlaceholder()}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FileUploadSection
                id="front-doc-upload"
                label={
                  <>
                    ID Front View <span className="text-red-500">*</span>
                  </>
                }
                value={documentData.frontView}
                loading={loadingStates.frontView}
                onChange={(e) => handleFileUpload(e, "image", "frontView")}
                onRemove={() => removeFile("frontView")}
                type="image"
              />
              <FileUploadSection
                id="back-doc-upload"
                label={
                  <>
                    ID Back View{" "}
                    {selectedIdType !== "passport" && (
                      <span className="text-red-500">*</span>
                    )}
                  </>
                }
                value={documentData.backView}
                loading={loadingStates.backView}
                onChange={(e) => handleFileUpload(e, "image", "backView")}
                onRemove={() => removeFile("backView")}
                type="image"
              />
            </div>
          </div>

          {/* Biometric Verification */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h3 className="text-primaryGold font-rajdhani font-medium">
              Biometric Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadSection
                id="selfie-upload"
                label={
                  <>
                    Selfie with ID <span className="text-red-500">*</span>
                    <span className="block text-xs text-white/60 mt-1">
                      (Hold your ID next to your face)
                    </span>
                  </>
                }
                value={selfie}
                loading={loadingStates.selfie}
                onChange={(e) => handleFileUpload(e, "image", "selfie")}
                onRemove={() => removeFile("selfie")}
                type="image"
              />
              {/* <FileUploadSection
                id="liveness-upload"
                label={
                  <>
                    Liveness Video <span className="text-red-500">*</span>
                    <span className="block text-xs text-white/60 mt-1">
                      (State your name and today's date)
                    </span>
                  </>
                }
                value={livenessVideo}
                loading={loadingStates.livenessVideo}
                onChange={(e) => handleFileUpload(e, "video", "livenessVideo")}
                onRemove={() => removeFile("livenessVideo")}
                type="video"
              /> */}
            </div>
          </div>

          {/* Fundraiser Proofs */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <h3 className="text-primaryGold font-rajdhani font-medium">
              Fundraiser Proofs (Image)
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Upload supporting documents for your fundraiser (e.g., medical bills, invoices, etc.)
            </p>

            {/* Grid of uploaded proofs */}
            {fundRaiseProofs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fundRaiseProofs.map((proof, index) => (
                  <ProofItem
                    key={index}
                    proof={proof}
                    onRemove={() => removeFile("proof", index)}
                  />
                ))}
              </div>
            )}

            {/* Upload button */}
            <div className="mt-4">
              <input
                type="file"
                id="proof-upload"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload(e, "image", "proof")}
                className="hidden"
              />
              <Label htmlFor="proof-upload" className="cursor-pointer">  {/* Add cursor-pointer */}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={loadingStates.proof}
                  onClick={() => document.getElementById("proof-upload")?.click()}  // Fallback
                >
                  {loadingStates.proof ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Proof Document
                </Button>
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSubmitVerification}
              disabled={
                isSubmitting ||
                !selectedIdType ||
                !idNumber ||
                !selfie ||
                // !livenessVideo ||
                !documentData.frontView ||
                !mobileNumber
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Verification"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Extracted components for better readability and reusability

const FileUploadSection = ({
  id,
  label,
  value,
  loading,
  onChange,
  onRemove,
  type,
}: {
  id: string;
  label: React.ReactNode;
  value: string;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  type: "image" | "video" | "pdf";
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-white">{label}</Label>
    {!value ? (
      <UploadArea id={id} loading={loading} onChange={onChange} type={type} />
    ) : (
      <PreviewWithRemove
        src={value}
        onRemove={onRemove}
        isVideo={type === "video"}
      />
    )}
  </div>
);

const UploadArea = ({
  id,
  loading,
  onChange,
  type,
}: {
  id: string;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "image" | "video" | "pdf";
}) => (
  <div className="relative">
    <input
      type="file"
      id={id}
      accept={`${type === "pdf" ? "application/pdf" : `${type}/*`}`}
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="border-2 border-dashed border-[#f2bd74]/30 rounded-lg p-6 text-center hover:bg-[#f2bd74]/5 transition-colors">
      {loading && (
        <div className="absolute border flex items-center justify-center border-primaryGold w-6 h-6 top-2 bg-primary right-2 rounded-full">
          <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
        </div>
      )}
      <div className="flex flex-col items-center">
        <FiUploadCloud className="h-10 w-10 text-[#f2bd74] mb-2" />
        <span className="text-sm text-white/80">
          Click to upload{" "}
          {type === "image"
            ? "an image"
            : type === "video"
              ? "a video"
              : "a document"}
        </span>
      </div>
    </div>
  </div>
);

const PreviewWithRemove = ({
  src,
  onRemove,
  isVideo,
}: {
  src: string;
  onRemove: () => void;
  isVideo: boolean;
}) => (
  <div className="relative">
    {isVideo ? (
      <video
        src={src}
        controls
        className="w-full h-48 border border-white/20 object-cover rounded-lg"
      />
    ) : src.endsWith(".pdf") ? (
      <div className="w-full h-48 bg-white/10 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <FileText className="h-10 w-10 mx-auto text-primaryGold" />
          <p className="text-xs text-white/60 truncate max-w-xs">{src}</p>
        </div>
      </div>
    ) : (
      <Image
        src={src}
        alt="Preview"
        height={1000}
        width={1000}
        className="object-cover w-full h-48 border border-white/20 rounded-lg"
        unoptimized // For external URLs
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

const ProofItem = ({
  proof,
  onRemove,
}: {
  proof: ProofFile;
  onRemove: () => void;
}) => (
  <div className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10">
    {proof.file.endsWith(".pdf") ? (
      <div className="p-4 h-full flex flex-col">
        <div className="bg-white/10 rounded-lg flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <FileText className="h-10 w-10 mx-auto text-primaryGold" />
            <p className="mt-2 text-sm font-medium text-white truncate">
              {proof.type || "PDF Document"}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div className="relative aspect-square">
        <Image
          src={proof.file}
          alt="Proof"
          fill
          className="object-cover"
          unoptimized // For external URLs
        />
      </div>
    )}
    <Button
      size="icon"
      variant="ghost"
      onClick={onRemove}
      className="absolute top-2 right-2 rounded-full bg-red-500/90 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="h-4 w-4" />
    </Button>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
      <p className="text-xs text-white truncate">
        {proof.type || (proof.file.endsWith(".pdf") ? "PDF Document" : "Image")}
      </p>
    </div>
  </div>
);

export default VerifyFundraising;
