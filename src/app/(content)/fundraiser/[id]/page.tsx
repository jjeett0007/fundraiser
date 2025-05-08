"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Share2, QrCode, Clock, Heart } from "lucide-react";

// User information dialog component
const UserInfoDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userInfo: {
    name: string;
    email: string;
    note: string;
    isAnonymous: boolean;
    amount: number;
  }) => void;
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Your Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Note (Optional)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="anonymous">Make donation anonymous</label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({ name, email, note, isAnonymous, amount: 0 })
            }
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FundraiserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [customAmount, setCustomAmount] = React.useState("");
  const [showUserInfoDialog, setShowUserInfoDialog] = React.useState(false);

  const fundraiser = {
    id: "fund_00001",
    title: "Medical Emergency Support for Sarah",
    description:
      "Sarah was recently diagnosed with a rare condition requiring immediate treatment. The medical costs are overwhelming for her family, and they need our support during this difficult time. Any contribution, no matter how small, will make a significant difference in helping Sarah receive the care she needs.",
    goalAmount: 5000,
    raisedAmount: 2750,
    createdAt: "2023-05-15T10:30:00Z",
    category: "Medical",
    walletAddress: "8xj7dkE9JDkf82jS6Qgp2H7K5uyJM9N1X2L",
    imageUrl:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
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

  const handleUserInfoSubmit = async (userInfo: {
    name: string;
    email: string;
    note: string;
    isAnonymous: boolean;
    amount: number;
  }) => {
    // Calculate the final amount
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    // Navigate to payment page with user info and fundraiser details
    router.push(
      `/payment?amount=${amount}&fundraiserId=${(await params).id}&name=${encodeURIComponent(userInfo.name)}&email=${encodeURIComponent(userInfo.email)}&note=${encodeURIComponent(userInfo.note)}&isAnonymous=${userInfo.isAnonymous}`,
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Badge className="mb-2 bg-[#FEC601] text-black">
              {fundraiser.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{fundraiser.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>Created {getRelativeTime(fundraiser.createdAt)}</span>
            </div>
          </div>

          <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
            <Image
              src={fundraiser.imageUrl}
              alt={fundraiser.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-2xl"
            />
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-lg whitespace-pre-line">
                {fundraiser.description}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="donors" className="mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="donors" className="flex-1">
                Donors
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex-1">
                Updates
              </TabsTrigger>
            </TabsList>
            <TabsContent value="donors" className="mt-4">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Recent Donors</h3>
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
            <TabsContent value="updates" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">No updates yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 md:top-[6rem]">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {formatCurrency(fundraiser.raisedAmount)}
                  </h2>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold">Select an amount</h3>
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
                    className="pl-6"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    $
                  </span>
                </div>
                <Separator />
                <Button
                  className="w-full bg-[#FF3A20] hover:bg-[#FF3A20]/90"
                  onClick={() => {
                    const amount = customAmount
                      ? parseFloat(customAmount)
                      : selectedAmount;
                    if (amount > 0) {
                      setShowUserInfoDialog(true);
                    }
                  }}
                >
                  <Heart className="mr-2 h-4 w-4" /> Contribute Now
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="outline" size="sm">
                  <QrCode className="mr-2 h-4 w-4" /> QR Code
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  Recipient wallet: {fundraiser.walletAddress.substring(0, 6)}
                  ...
                  {fundraiser.walletAddress.substring(
                    fundraiser.walletAddress.length - 4,
                  )}
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* User Information Dialog */}
      <UserInfoDialog
        isOpen={showUserInfoDialog}
        onClose={() => setShowUserInfoDialog(false)}
        onSubmit={handleUserInfoSubmit}
      />
    </div>
  );
}
