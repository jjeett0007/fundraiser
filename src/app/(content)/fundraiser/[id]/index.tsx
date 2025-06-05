"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Share2,
  QrCode,
  Clock,
  Heart,
  Zap,
  Users,
  Shield,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import type {
  FundraiserByIdData,
  DonorByIdData,
  PaginationData,
} from "@/utils/type";
import UserInfoDialog from "./components/UserInfoDialog";
import {
  getRelativeTime,
  formatDate,
} from "@/components/customs/customComponent";
import SuccessDialog from "./components/SuccessDialog";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PaginationComp from "@/components/customs/PaginationComp";
import { Skeleton } from "@/components/ui/skeleton";

type props = {
  fundraiserId: string;
};

export default function FundraiserPageComp({ fundraiserId }: props) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [fundraiser, setFundraiser] = useState<FundraiserByIdData | null>(null);
  const [donors, setDonors] = useState<DonorByIdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [isSuccessDialog, setIsSuccessDialog] = useState(false);
  const [openQRCode, setIsOpenQRCode] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationType, setValidationType] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [donationPaginationData, setDonationPaginationData] =
    useState<PaginationData>({
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
      pageSize: 9,
    });
  const [donationPaginationLoading, setDonationPaginationLoading] =
    useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      setIsOverflowing(
        descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight
      );
    }
  }, [fundraiser?.fundMetaData?.description]);

  const qrValue = `https://www.emergfunds.org/fundraiser/${fundraiserId}`;

  useEffect(() => {
    if (searchParams.get("paymentSuccessful") === "true") {
      setIsSuccessDialog(true);

      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= donationPaginationData.totalPages) {
      setDonationPaginationData((prev) => ({ ...prev, currentPage: newPage }));
      fetchDonation(newPage);
    }
  };

  const fetchDonation = async (page: number = 1) => {
    setDonationPaginationLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/fundraise/donate/${fundraiserId}?page=${page}`
      );
      if (response.success) {
        setDonors(response.data.results);
        if (response?.data?.pagination) {
          setDonationPaginationData(response.data.pagination);
        }
        setDonationPaginationLoading(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch donors",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching donors",
        variant: "destructive",
      });
    }
  };

  const fetchFundraiserDetails = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/fundraise/get-fundraise/${fundraiserId}`
      );

      if (response.success) {
        setFundraiser(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch fundraiser details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching fundraiser details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    await Promise.all([fetchFundraiserDetails(), fetchDonation()]);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && fundraiserId) {
      initializeData();
    }
    return () => {
      mounted = false;
    };
  }, [fundraiserId]);

  const handleDialogClose = () => {
    setIsSuccessDialog(false);
  };

  const handleCustomAmountOnChange = (e: { target: { value: string } }) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (/^\d*\.?\d*$/.test(rawValue)) {
      const decimalCount = (rawValue.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        let formattedValue = "";
        if (rawValue) {
          const parts = rawValue.split(".");
          const integerPart = parts[0] ? formatNumberWithCommas(parts[0]) : "";
          const decimalPart = parts[1] !== undefined ? parts[1] : "";

          if (parts.length === 2) {
            formattedValue = integerPart + "." + decimalPart;
          } else {
            formattedValue = integerPart;
          }
        }

        setCustomAmount(formattedValue);
        setSelectedAmount(0);

        if (rawValue && fundraiser) {
          const inputAmount = parseFloat(rawValue);
          if (!isNaN(inputAmount)) {
            const totalRaised = Number(fundraiser.statics.totalRaised);
            const goalAmount = Number(fundraiser.fundMetaData.goalAmount);
            const maxAllowed =
              Math.round((goalAmount - totalRaised) * 100) / 100;
            const inputAmountRounded = Math.round(inputAmount * 100) / 100;

            if (inputAmountRounded <= 0) {
              setValidationMessage("Please enter a positive amount");
              setValidationType(false);
            } else if (inputAmountRounded > maxAllowed) {
              setValidationMessage(
                `This amount exceeds the goal. Maximum allowed: ${formatCurrency(maxAllowed)}`
              );
              setValidationType(false);
            } else if (Math.abs(inputAmountRounded - maxAllowed) < 0.01) {
              setValidationMessage(
                "Awesome! This will complete the fundraiser goal 🎉"
              );
              setValidationType(true);
            } else {
              setValidationMessage("");
              setValidationType(true);
            }
          } else {
            setValidationMessage("");
            setValidationType(true);
          }
        } else {
          setValidationMessage("");
          setValidationType(true);
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumberWithCommas = (num: string) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDonation = async (userInfo: {
    name: string;
    email: string;
    note: string;
    isAnonymous: boolean;
  }) => {
    const amount = customAmount
      ? Number.parseFloat(customAmount)
      : selectedAmount;
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please select a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    if (fundraiser) {
      const totalRaised = fundraiser.statics.totalRaised;
      const goalAmount = fundraiser.fundMetaData.goalAmount;
      const projectedTotal = totalRaised + amount;

      if (projectedTotal > goalAmount) {
        const maxAllowed = goalAmount - totalRaised;
        toast({
          title: "Amount exceeds goal",
          description: `Maximum allowed donation: ${formatCurrency(maxAllowed)}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const payload = {
        name: userInfo.name,
        email: userInfo.email,
        amount: amount,
        note: userInfo.note,
        anonymous: userInfo.isAnonymous,
      };

      const response = await apiRequest(
        "POST",
        `/fundraise/donate/${fundraiserId}`,
        payload
      );

      if (response.success) {
        setShowUserInfoDialog(false);
        router.push("/payment");
        localStorage.setItem("donateId", response.data.donateId);
        localStorage.setItem(
          "fundraiserDetails",
          JSON.stringify({
            imageUrl: fundraiser?.fundMetaData.imageUrl,
            title: fundraiser?.fundMetaData.title,
            fundraiserId: fundraiserId,
          })
        );
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to process donation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your donation",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    if (!fundraiser) return;
    const message = `Check out this fundraiser: ${fundraiser.fundMetaData.title}`;
    const url = qrValue;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Fundraiser link copied to clipboard",
          variant: "default",
        });
        break;
    }
    setOpenShare(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[#f2bd74] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#f2bd74]">Loading fundraiser details...</p>
        </div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white flex justify-center items-center">
        <p className="text-[#f2bd74]">Fundraiser not found</p>
      </div>
    );
  }

  const { fundMetaData } = fundraiser;
  const progressPercentage =
    (fundraiser.statics.totalRaised / fundMetaData.goalAmount) * 100;

  return (
    <>
      <SuccessDialog
        isOpen={isSuccessDialog}
        onClose={handleDialogClose}
        fundraiserTitle={fundMetaData.title}
      />

      <Dialog open={openShare} onOpenChange={setOpenShare}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] h-fit lg:max-w-[30%]">
          <DialogHeader>
            <DialogTitle>Share Fundraiser</DialogTitle>
            <DialogDescription>
              Share this fundraiser with your network
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-6 w-6" />
              <span>
                <s>Twitter</s> X
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-6 w-6" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-6 w-6" />
              <span>LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2 border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10"
              onClick={() => handleShare("whatsapp")}
            >
              <MessageCircle className="h-6 w-6" />
              <span>WhatsApp</span>
            </Button>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setOpenShare(false)}
              className="w-full"
              variant="ghost"
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleShare("copy")}
            >
              <span>Copy Link</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openQRCode} onOpenChange={setIsOpenQRCode}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] h-fit lg:max-w-[30%]">
          <DialogHeader>
            <DialogTitle> QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to share this fundraiser with others or copy the
              link below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCode
                value={qrValue}
                size={200}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
            <p className="mt-4 text-sm text-center text-gray-500">
              Or copy this link: {qrValue}
            </p>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-center gap-2 w-full">
              <Button
                onClick={() => setIsOpenQRCode(false)}
                className="w-full sm:w-auto"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(qrValue);
                  toast({
                    title: "Link copied",
                    description:
                      "The fundraiser link has been copied to clipboard",
                    variant: "default",
                  });
                }}
                className="w-full sm:w-auto"
                variant="outline"
              >
                Copy Link
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className=" text-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] opacity-5 blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Badge className="mb-2 capitalize font-rajdhani  bg-primaryRed text-white border-0">
                  {fundMetaData.category}
                </Badge>
                <h1 className="text-3xl font-rajdhani font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74]">
                  {fundMetaData.title}
                </h1>
                <div className="flex items-center text-gray-400 mb-4">
                  <Clock className="h-4 w-4 mr-1 text-[#f2bd74]" />
                  <span className="text-sm text-[#ede4d3]">
                    Created{" "}
                    {getRelativeTime(fundraiser.isFundRaisedStartedDate)}
                  </span>
                </div>
              </div>

              <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden group">
                <Image
                  src={fundMetaData.imageUrl || "/placeholder.svg"}
                  alt={fundMetaData.title}
                  className="rounded-2xl w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  width={1000}
                  height={1000}
                />

                {/* Blockchain verification badge */}
                {fundraiser.verify.isFundRaiseVerified && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-[#0a1a2f]/80 backdrop-blur-sm border border-[#f2bd74]/30 text-[#f2bd74] flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Verified
                    </Badge>
                  </div>
                )}
              </div>

              <h3 className="text-xl mb-2 font-rajdhani font-semibold text-[#f2bd74]">
                The Story
              </h3>
              <Card className="mb-8 bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
                <CardContent className="pt-6">
                  <div
                    ref={descriptionRef}
                    className={`text-[14px] whitespace-pre-line overflow-hidden text-gray-300 ${
                      isExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {fundMetaData.description}
                  </div>
                  {isOverflowing && (
                    <Button
                      variant={"ghost"}
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-0 h-auto text-[12px] text-[#eedfc2]"
                      size={"sm"}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="donors" className="mb-8">
                <TabsList className="w-full bg-transparent border border-[#f2bd74]/20">
                  <TabsTrigger
                    value="donors"
                    className="flex-1 data-[state=active]:bg-[#0a1a2f] data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-[#f2bd74] text-[#ede4d3]"
                  >
                    <Users className="h-4 w-4 mr-2" /> Donors
                  </TabsTrigger>
                  <TabsTrigger
                    value="updates"
                    className="flex-1 data-[state=active]:bg-[#0a1a2f] data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-[#f2bd74] text-[#ede4d3]"
                  >
                    <Zap className="h-4 w-4 mr-2" /> Updates
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="donors" className="mt-4">
                  <Card className="bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
                    <CardHeader>
                      <h3 className="text-xl font-rajdhani font-semibold text-[#f2bd74]">
                        Recent Donors
                      </h3>
                    </CardHeader>
                    <CardContent>
                      {donationPaginationLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg bg-[#0a1a2f]/50 border border-[#f2bd74]/10"
                            >
                              <Skeleton className="h-10 w-10 rounded-full border-2 border-[#f2bd74]/20" />
                              <div className="w-full space-y-2">
                                <div className="flex justify-between">
                                  <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                  </div>
                                  <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : donors && donors.length > 0 ? (
                        <div className="space-y-4">
                          {donors.map((donor, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg bg-[#0a1a2f]/50 border border-[#f2bd74]/10"
                            >
                              <Avatar className="border-2 border-[#f2bd74]/20">
                                <AvatarImage
                                  src={`https://api.dicebear.com/9.x/identicon/svg?seed=${donor.name}`}
                                />
                                <AvatarFallback className="bg-[#bd0e2b]/20 text-[#f2bd74]">
                                  {donor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="w-full">
                                <div className="flex justify-between">
                                  <div className="flex items-start flex-col gap-1 ">
                                    <p className="font-medium font-rajdhani text-white">
                                      {donor.anonymous
                                        ? "Anonymous"
                                        : donor.name}
                                    </p>
                                    {donor.note && (
                                      <p className="mt-1 text-sm text-gray-300 italic">
                                        "{donor.note || "No message"}"
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-end flex-col gap-1 ">
                                    <p className="text-[#f2bd74] font-semibold">
                                      {formatCurrency(donor.amount)}
                                    </p>
                                    <p className="text-gray-400 text-sm flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDate(donor.blockTime)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <p className="text-gray-400">
                            No donors yet. Be the first to donate!
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <div className="w-full">
                      {donors.length > 0 && (
                        <div className=" flex items-center justify-center">
                          {donationPaginationLoading ? (
                            <Skeleton className="h-4 w-60" />
                          ) : (
                            <PaginationComp
                              currentPage={donationPaginationData.currentPage}
                              totalPages={donationPaginationData.totalPages}
                              onPageChange={handlePageChange}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="updates" className="mt-4">
                  <Card className="bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
                    <CardHeader>
                      <h3 className="text-xl font-rajdhani font-semibold text-[#f2bd74]">
                        Recent Updates
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-gray-400">No updates yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4 md:top-[6rem] bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] w-8 h-8 -top-4 -right-4 opacity-50"></div>
                </div>

                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl flex items-center gap-2 font-bold text-[#f2bd74]">
                        {formatCurrency(fundraiser.statics.totalRaised)}
                        <p className="text-gray-400 font-normal text-sm">
                          raised
                        </p>
                      </h2>
                      <p className="text-gray-400">
                        of {formatCurrency(fundMetaData.goalAmount)}
                      </p>
                    </div>

                    <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] rounded-full"
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <p className="flex items-center text-gray-300">
                        <Users className="h-3 w-3 mr-1 text-[#f2bd74]" />{" "}
                        {fundraiser.statics.totalDonor}{" "}
                        {fundraiser.statics.totalDonor <= 1
                          ? "donor"
                          : "donors"}
                      </p>
                      <p className="flex items-center text-gray-300">
                        <Zap className="h-3 w-3 mr-1 text-[#f2bd74]" />{" "}
                        {Math.round(progressPercentage)}% complete
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#f2bd74]">
                      Select an amount
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={selectedAmount === 5 ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(5);
                          setCustomAmount("");
                        }}
                      >
                        $5
                      </Button>
                      <Button
                        variant={selectedAmount === 10 ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(10);
                          setCustomAmount("");
                        }}
                      >
                        $10
                      </Button>
                      <Button
                        variant={selectedAmount === 25 ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(25);
                          setCustomAmount("");
                        }}
                      >
                        $25
                      </Button>
                      <Button
                        variant={selectedAmount === 50 ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(50);
                          setCustomAmount("");
                        }}
                      >
                        $50
                      </Button>
                    </div>
                    <div className="flex flex-col">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Custom amount"
                          className={`pl-6 bg-[#0a1a2f]/50 text-white placeholder:text-gray-500 ${
                            validationType === false
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-[#f2bd74]/30"
                          }`}
                          value={customAmount}
                          onChange={handleCustomAmountOnChange}
                          onPaste={(e) => {
                            setTimeout(() => {
                              const pastedValue = e.currentTarget.value;
                              handleCustomAmountOnChange({
                                target: { value: pastedValue },
                              });
                            }, 0);
                          }}
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f2bd74]">
                          $
                        </span>
                      </div>
                      {validationMessage && (
                        <p
                          className={`mt-2 text-sm ${
                            validationType === false
                              ? "text-red-400"
                              : validationType === true
                                ? "text-green-400"
                                : ""
                          }`}
                        >
                          {validationMessage}
                        </p>
                      )}
                    </div>
                    <Separator className="bg-[#f2bd74]/20" />
                    <Button
                      disabled={
                        fundraiser.isFundRaisedStopped ||
                        validationType === false
                      }
                      variant={"secondary"}
                      className="w-full "
                      onClick={() => {
                        const amount = customAmount
                          ? Number.parseFloat(customAmount)
                          : selectedAmount;
                        if (amount > 0) {
                          setShowUserInfoDialog(true);
                        } else {
                          toast({
                            title: "Invalid amount",
                            description:
                              "Please select a valid donation amount",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Heart className="mr-2 h-4 w-4" /> Contribute Now
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex-col space-y-4">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenShare(true)}
                      className="border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsOpenQRCode(true)}
                      size="sm"
                      className="border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white"
                    >
                      <QrCode className="mr-2 h-4 w-4" /> QR Code
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <UserInfoDialog
          isOpen={showUserInfoDialog}
          onClose={() => setShowUserInfoDialog(false)}
          onSubmit={handleDonation}
        />
      </div>
    </>
  );
}
