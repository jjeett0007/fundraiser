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
import { Clock, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export default function ManageFundraiserPage() {
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isStoppingFundraiser, setIsStoppingFundraiser] = useState(false);

  // Mock fundraiser data - in a real app, this would be fetched from an API
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
    donors: [
      {
        id: "1",
        name: "John D.",
        amount: 250,
        timestamp: "2023-05-15T14:30:00Z",
        message: "Stay strong, Sarah!",
      },
      {
        id: "2",
        name: "Anonymous",
        amount: 500,
        timestamp: "2023-05-16T09:15:00Z",
        message: "Wishing you a speedy recovery",
      },
      {
        id: "3",
        name: "Maria S.",
        amount: 100,
        timestamp: "2023-05-16T16:45:00Z",
        message: "Sending love and support",
      },
      {
        id: "4",
        name: "Anonymous",
        amount: 1000,
        timestamp: "2023-05-17T11:20:00Z",
        message: "Hope this helps",
      },
      {
        id: "5",
        name: "David R.",
        amount: 75,
        timestamp: "2023-05-17T19:10:00Z",
        message: "Get well soon!",
      },
      {
        id: "6",
        name: "Emily T.",
        amount: 825,
        timestamp: "2023-05-18T08:30:00Z",
        message: "We are all here for you",
      },
    ],
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
      const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
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
    <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Fundraiser</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/fundraiser/${fundraiser.id}`)}
        >
          View Public Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fundraiser Overview</CardTitle>
              <CardDescription>
                Created {getRelativeTime(fundraiser.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={fundraiser.imageUrl}
                    alt={fundraiser.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <Badge className="mb-2 bg-[#FEC601] text-black">
                    {fundraiser.category}
                  </Badge>
                  <h2 className="text-xl font-semibold">{fundraiser.title}</h2>
                  <p className="text-muted-foreground truncate max-w-md">
                    {fundraiser.description.substring(0, 100)}...
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {formatCurrency(fundraiser.raisedAmount)}
                  </h3>
                  <p className="text-muted-foreground">
                    raised of {formatCurrency(fundraiser.goalAmount)}
                  </p>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <p>{fundraiser.donors.length} donors</p>
                  <p>{Math.round(progressPercentage)}% complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="donations" className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="donations" className="flex-1">
                Donations
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                Statistics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="donations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fundraiser.donors.map((donor, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.id}`}
                          />
                          <AvatarFallback>
                            {donor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-primary font-semibold">
                              {formatCurrency(donor.amount)}
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {getRelativeTime(donor.timestamp)}
                          </p>
                          {donor.message && (
                            <p className="mt-1 text-sm">"{donor.message}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Total Raised
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(fundraiser.raisedAmount)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Total Donors
                      </p>
                      <p className="text-2xl font-bold">
                        {fundraiser.donors.length}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Average Donation
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          fundraiser.raisedAmount / fundraiser.donors.length,
                        )}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Largest Donation
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          Math.max(...fundraiser.donors.map((d) => d.amount)),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 md:top-[6rem]">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Manage your fundraiser and funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Wallet Address</p>
                <p className="text-xs text-muted-foreground break-all">
                  {fundraiser.walletAddress}
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Available to Withdraw</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(fundraiser.raisedAmount)}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleWithdrawFunds}
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

              <Separator className="my-4" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive hover:bg-destructive/10"
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
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently stop
                      your fundraiser and prevent any further donations.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStopFundraiser}>
                      Yes, stop fundraiser
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
