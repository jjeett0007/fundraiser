"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";
import { Donor } from "@/utils/type";

export default function ManageFundraiserPage() {
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isStoppingFundraiser, setIsStoppingFundraiser] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);

  const fundraiser = {
    id: "123",
    title: "Medical Emergency Support for Sarah",
    description:
      "Sarah was recently diagnosed with a rare condition requiring immediate treatment. The medical costs are overwhelming for her family, and they need our support during this difficult time.",
    goalAmount: 5000,
    raisedAmount: 2750,
    createdAt: "2023-05-15T10:30:00Z",
    category: "Medical",
    walletAddress: "8xj7dkE9JDkf82jS6Qgp2H7K5uyJM9N1X2L",
    imageUrl:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
    status: "active",
  };

  const progressPercentage =
    (fundraiser.raisedAmount / fundraiser.goalAmount) * 100;

  const getRelativeTime = (dateString: string | number | Date) => {
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

  const formatCurrency = (amount: string | number | bigint) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numericAmount);
  };

  const handleWithdrawFunds = () => {
    setIsWithdrawing(true);
    // Mock API call to withdraw funds
    setTimeout(() => {
      setIsWithdrawing(false);
      alert("Funds have been withdrawn to your wallet!");
    }, 2000);
  };

  const handleStopFundraiser = () => {
    setIsStoppingFundraiser(true);
    // Mock API call to stop fundraiser
    setTimeout(() => {
      setIsStoppingFundraiser(false);
      alert("Fundraiser has been stopped!");
      // In a real app, you would update the fundraiser status
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-rajdhani font-bold text-[#f2bd74]">
          Manage Fundraiser
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/fundraiser/${fundraiser.id}`)}
        >
          View Public Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6 bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-xl font-rajdhani font-bold text-[#f2bd74]">
                Fundraiser Overview
              </CardTitle>
              <CardDescription className="text-[#ede4d3]">
                Created {getRelativeTime(fundraiser.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src={fundraiser.imageUrl}
                  alt={fundraiser.title}
                  width={1000}
                  height={1000}
                  className="object-cover w-24 h-24 rounded-lg"
                />
                <div>
                  <Badge className="mb-2 capitalize font-rajdhani  bg-primaryRed text-white border-0">
                    {fundraiser.category}
                  </Badge>
                  <h2 className="text-xl font-semibold">{fundraiser.title}</h2>
                  <p className="text-[#ede4d3] line-clamp-2 max-w-md">
                    {fundraiser.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {formatCurrency(fundraiser.raisedAmount)}
                  </h3>
                  <p className="text-[ #ede4d3]">
                    raised of {formatCurrency(fundraiser.goalAmount)}
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
                value="stats"
                className="flex-1 data-[state=active]:bg-[#0a1a2f] data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-[#f2bd74] text-[#ede4d3]"
              >
                <Zap className="h-4 w-4 mr-2" /> Stats
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
                        No donors yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <Card className="bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-[#f2bd74]">
                    Statistics
                  </h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                      <p className="text-sm opacity-80 font-medium line-clamp-1">
                        Total Raised
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(fundraiser.raisedAmount)}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                      <p className="text-sm opacity-80 font-medium line-clamp-1">
                        Total Donors
                      </p>
                      <p className="text-2xl font-bold">2</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                      <p className="text-sm opacity-80 font-medium line-clamp-1">
                        Average Amount
                      </p>
                      <p className="text-2xl font-bold">$100</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                      <p className="text-sm opacity-80 font-medium line-clamp-1">
                        Largest Amount
                      </p>
                      <p className="text-2xl font-bold">$500</p>
                    </div>
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
              <CardTitle className="text-xl font-bold font-rajdhani text-[#f2bd74]">
                Actions
              </CardTitle>
              <CardDescription className="text-[#ede4d3] ">
                Manage your fundraiser and funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                <p className="text-sm opacity-80 font-medium line-clamp-1">
                  Wallet Address
                </p>
                <p className="text-xs ">{fundraiser.walletAddress}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-start flex-col border-white/10">
                <p className="text-sm opacity-80 font-medium line-clamp-1">
                  Available to Withdraw
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(fundraiser.raisedAmount)}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleWithdrawFunds}
                variant="secondary"
                disabled={isWithdrawing || fundraiser.raisedAmount === 0}
              >
                {isWithdrawing ? (
                  "Processing..."
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" /> Withdraw Funds
                  </>
                )}
              </Button>

              <Separator className="bg-[#f2bd74]/20" />

              <Button
                variant="destructive"
                className="w-full"
                disabled={isStoppingFundraiser}
              >
                {isStoppingFundraiser ? (
                  "Processing..."
                ) : (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" /> Stop Fundraiser
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
