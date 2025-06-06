"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiMoney } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Edit,
  Trash,
  Zap,
  Shield,
  Rocket,
  Landmark,
  Users,
  DollarSign,
  ArrowBigUpDash,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import apiRequest from "@/utils/apiRequest";
import { Separator } from "@/components/ui/separator";

interface FundraiserCardProps {
  id: string;
  title: string;
  createdAt: string;
  category: string;
  goalAmount: number;
  amountRaised: number;
  imageUrl: string;
  description: string;
  isFundRaiseVerified: boolean;
  updatedResponse?: () => void;
  totalRaised: number;
  totalDonor: number;
  averageDonation: number;
  largestAmount: number;
  isFundRaiseDeactivated: boolean;
  isFundRaiseStarted: boolean;
  isFundRaiseEnded: boolean;
  isFundRaiseActive: boolean;
  isFundRaisedStopped: boolean;
}

const UserFundraiserCard = ({
  id,
  title,
  createdAt,
  category,
  goalAmount,
  amountRaised,
  imageUrl,
  description,
  isFundRaiseVerified,
  updatedResponse,
  totalRaised,
  totalDonor,
  averageDonation,
  largestAmount,
  isFundRaiseDeactivated,
  isFundRaiseStarted,
  isFundRaiseEnded,
  isFundRaiseActive,
  isFundRaisedStopped,
}: FundraiserCardProps) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [launchIsLoading, setLaunchIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progressPercentage = Math.min(
    Math.round((amountRaised / goalAmount) * 100),
    100
  );

  const getTimeSince = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - created.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const handleDelete = async () => {
    if (isFundRaiseDeactivated) return;

    try {
      setIsLoading(true);

      const response = await apiRequest("DELETE", `/fundraise/delete/${id}`);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || " Fundraiser deleted successfully.",
        });
        setOpen(false);
        setIsLoading(false);

        if (updatedResponse) {
          updatedResponse();
        }
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to delete Fundraiser",
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

  const handleLaunch = async () => {
    if (isFundRaiseDeactivated) return;

    try {
      setLaunchIsLoading(true);

      const response = await apiRequest(
        "POST",
        `/fundraise/start-fundraise/${id}`
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || " Fundraiser launched successfully.",
        });
        setLaunchIsLoading(false);

        if (updatedResponse) {
          updatedResponse();
        }
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to launch Fundraiser",
        });
        setLaunchIsLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLaunchIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open && !isFundRaiseDeactivated} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] h-[30vh] lg:max-w-[30%] md:h-fit">
          <DialogHeader>
            <DialogTitle> Delete? </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {title}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="flex item-center justify-center gap-2">
              <Button
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
                variant="ghost"
                disabled={isLoading}
              >
                No
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleDelete}
                className="w-full"
                variant="destructive"
              >
                {isLoading ? "Deleting..." : " Yes, Delete"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative group">
        <Card className="relative border-[#7b7b7b] bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white border overflow-hidden rounded-xl z-10">
          <div className="absolute w-[92%] flex items-center justify-between top-4 right-4 z-20">
            {isFundRaiseVerified === true ? (
              <Badge className="bg-gradient-to-r from-[#256b25] to-emerald-600 border-0 text-white">
                Verified
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 border-0 text-white">
                Not Verified
              </Badge>
            )}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => !isFundRaiseDeactivated && setOpen(true)}
              className="h-9 w-9 border border-[#fff0f2]/40 text-white"
              disabled={isFundRaiseDeactivated}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative h-48 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2f] via-transparent to-transparent z-10"></div>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              height={1000}
              width={1000}
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
            />

            <div className="absolute w-[92%] flex items-center justify-between bottom-4 left-4 z-20">
              <Badge
                className={`bg-[#bd0e2b]/80 backdrop-blur-sm border border-[#f2bd74]/30 text-white hover:bg-[#bd0e2b]`}
              >
                {category}
              </Badge>
              {isFundRaiseActive && (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0dd60d]"></span>
                  </span>
                  <Badge className="bg-gradient-to-r from-[#256b25] to-emerald-600 border-0 text-white">
                    Active
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <CardHeader className="pb-2">
            <div className="flex flex-col items-start">
              <CardTitle className="text-xl rajdhani font-bold line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74]">
                {title}
              </CardTitle>
              <CardDescription className="line-clamp-1 text-[#ede4d3] mt-1">
                {description}
              </CardDescription>
              {createdAt ? (
                <div className="flex py-1 px-2 bg-white/10 rounded-full items-center mt-1 text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">
                    Launched {getTimeSince(createdAt)}
                  </span>
                </div>
              ) : (
                <span className="text-xs py-1 px-2 bg-white/10 rounded-full text-gray-300 font-medium">
                  Not launched yet
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-4 mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[#f2bd74]">
                  {formatCurrency(amountRaised)} Raised
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {formatCurrency(goalAmount)} Goal
                </span>
              </div>

              <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#f2bd74]">
                {formatCurrency(goalAmount - amountRaised)} Left to Raise
              </span>
              <div className="flex items-center">
                <Zap className="h-3 w-3 text-[#f2bd74] mr-1" />
                <span className="text-xs font-medium text-gray-300">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 border border-white/20 p-1 rounded-lg">
              <div className="px-2 py-1 rounded-lg bg-white/5">
                <div className="justify-center flex items-center gap-2 text-xs opacity-80 font-light">
                  <Landmark className="h-3 w-3" />
                  <p className="text-xs">{formatCurrency(totalRaised)}</p>
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5">
                <div className="justify-center flex items-center gap-2 text-xs opacity-80 font-light">
                  <Users className="h-3 w-3" />
                  <p className="text-xs">{totalDonor}</p>
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5">
                <div className="justify-center flex items-center gap-2 text-xs opacity-80 font-light">
                  <DollarSign className="h-3 w-3" />
                  <p className="text-xs">{formatCurrency(averageDonation)}</p>
                </div>
              </div>

              <div className="px-2 py-1 rounded-lg bg-white/5">
                <div className="justify-center flex items-center gap-2 text-xs opacity-80 font-light">
                  <ArrowBigUpDash className="h-3 w-3" />
                  <p className="text-xs">{formatCurrency(largestAmount)}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-[#f2bd74]/20" />
          </CardContent>

          <CardFooter className="pt-0">
            <div className="w-full space-y-3">
              <div className="flex justify-between">
                <Link
                  href={
                    isFundRaiseDeactivated ? "#" : `/fundraiser/manage/${id}`
                  }
                  className="flex-1 mr-2"
                  style={{
                    pointerEvents: isFundRaiseDeactivated ? "none" : "auto",
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full border border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white transition-all duration-300"
                    disabled={isFundRaiseDeactivated}
                  >
                    <PiMoney className="h-4 w-4 mr-2" />
                    Manage Or Withdraw
                  </Button>
                </Link>

                <div className="flex space-x-2">
                  <Link
                    href={isFundRaiseDeactivated ? "#" : `/fundraiser/${id}`}
                    style={{
                      pointerEvents: isFundRaiseDeactivated ? "none" : "auto",
                    }}
                  >
                    <Button
                      variant="outline"
                      className="w-full border border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white transition-all duration-300"
                      disabled={isFundRaiseDeactivated}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>

              {!isFundRaiseStarted && (
                <Button
                  onClick={handleLaunch}
                  variant="secondary"
                  className="w-full"
                  disabled={isFundRaiseDeactivated}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  {launchIsLoading ? "Launching..." : " Launch Fundraiser"}
                </Button>
              )}
            </div>
          </CardFooter>

          {isFundRaiseDeactivated && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
              <div className="text-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-xl font-rajdhani font-bold text-white mb-2">
                  Fundraiser Deactivated
                </h3>
                <p className="text-gray-300 text-sm">
                  This fundraiser has been deactivated.
                  <br />
                  Please contact support for assistance.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default UserFundraiserCard;
