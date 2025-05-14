"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
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
  CheckCircle2,
  Zap,
  Users,
  Shield,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import type { FundraiserData, Donor } from "@/utils/type";
import { motion } from "framer-motion";
import UserInfoDialog from "./components/UserInfoDialog";
import SuccessDialog from "./components/SuccessDialog";

// User information dialog component

export default function FundraiserPage() {
  const router = useRouter();
  const params = useParams();
  const fundraiserId = params.id as string;
  const { toast } = useToast();
  const userData = useSelector((state: RootState) => state.userData);

  const [fundraiser, setFundraiser] = useState<FundraiserData | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);

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
    await Promise.all([fetchFundraiserDetails()]);
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

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

    try {
      const payload = {
        name: userInfo.name,
        email: userInfo.email,
        amount: amount,
        note: userInfo.note,
        // isAnonymous: userInfo.isAnonymous,
      };

      const response = await apiRequest(
        "POST",
        `/fundraise/donate/${fundraiserId}`,
        payload
      );

      console.log(response);

      if (response.success) {
        setDonationAmount(amount);
        setShowUserInfoDialog(false);
        setShowSuccessDialog(true);

        // Refresh fundraiser details after successful donation
        fetchFundraiserDetails();
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
    (fundMetaData.currentAmount / fundMetaData.goalAmount) * 100;

  return (
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
                  Created {getRelativeTime(fundraiser.isFundRaisedStartedDate)}
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
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-[#0a1a2f]/80 backdrop-blur-sm border border-[#f2bd74]/30 text-[#f2bd74] flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Verified on Chain
                </Badge>
              </div>
            </div>

            <Card className="mb-8 bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
              <CardContent className="pt-6">
                <p className="text-lg whitespace-pre-line text-gray-300">
                  {fundMetaData.description}
                </p>
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
                    <h3 className="text-xl font-semibold text-[#f2bd74]">
                      Recent Donors
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {donors.length > 0 ? (
                      <div className="space-y-4">
                        {donors.map((donor, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-3 rounded-lg bg-[#0a1a2f]/50 border border-[#f2bd74]/10"
                          >
                            <Avatar className="border-2 border-[#f2bd74]/20">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor._id}`}
                              />
                              <AvatarFallback className="bg-[#bd0e2b]/20 text-[#f2bd74]">
                                {donor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-white">
                                  {donor.isAnonymous ? "Anonymous" : donor.name}
                                </p>
                                <p className="text-[#f2bd74] font-semibold">
                                  {formatCurrency(donor.amount)}
                                </p>
                              </div>
                              <p className="text-gray-400 text-sm flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {getRelativeTime(donor.timestamp)}
                              </p>
                              {donor.note && (
                                <p className="mt-1 text-sm text-gray-300 italic">
                                  "{donor.note}"
                                </p>
                              )}
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
                </Card>
              </TabsContent>
              <TabsContent value="updates" className="mt-4">
                <Card className="bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-[#f2bd74]">
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
                    <h2 className="text-2xl font-bold text-[#f2bd74]">
                      {formatCurrency(fundMetaData.currentAmount)}
                    </h2>
                    <p className="text-gray-400">
                      raised of {formatCurrency(fundMetaData.goalAmount)}
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
                      {donors.length} donors
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
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      min="1"
                      className="pl-6 bg-[#0a1a2f]/50 border-[#f2bd74]/30 text-white placeholder:text-gray-500"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f2bd74]">
                      $
                    </span>
                  </div>
                  <Separator className="bg-[#f2bd74]/20" />
                  <Button
                    className="w-full "
                    variant="secondary"
                    onClick={() => {
                      const amount = customAmount
                        ? Number.parseFloat(customAmount)
                        : selectedAmount;
                      if (amount > 0) {
                        setShowUserInfoDialog(true);
                      } else {
                        toast({
                          title: "Invalid amount",
                          description: "Please select a valid donation amount",
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
                    className="border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button
                    variant="outline"
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
        userData={userData}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        amount={donationAmount}
        fundraiserTitle={fundraiser?.fundMetaData?.title || ""}
      />
    </div>
  );
}
