"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash, Zap, Shield, Rocket } from "lucide-react";
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
    try {
      setLaunchIsLoading(true);

      const response = await apiRequest(
        "POST",
        `/fundraise/start-fundraise/${id}`
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || " Fundraiser deleted successfully.",
        });
        setLaunchIsLoading(false);

        if (updatedResponse) {
          updatedResponse();
        }
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to delete Fundraiser",
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] h-[30vh] lg:max-w-[30%] md:h-fit">
          <DialogHeader>
            <DialogTitle> Delete? </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this fundraiser? This action
              cannot be undone.
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
          <div className="absolute top-4 right-4 z-20">
            {isFundRaiseVerified === true ? (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white">
                  Verified
                </Badge>
              </div>
            ) : (
              <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 border-0 text-white">
                Not Verified
              </Badge>
            )}
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

            <div className="absolute bottom-4 left-4 z-20">
              <Badge
                className={`bg-[#bd0e2b]/80 backdrop-blur-sm border border-[#f2bd74]/30 text-white hover:bg-[#bd0e2b]`}
              >
                {category}
              </Badge>
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
              {createdAt && (
                <div className="flex items-center mt-1 text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">
                    Created on {getTimeSince(createdAt)}
                  </span>
                </div>
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

              <div className="mt-2 flex items-center">
                <Zap className="h-4 w-4 text-[#f2bd74] mr-1" />
                <span className="text-xs font-medium text-gray-300">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="w-full space-y-3">
              <div className="flex justify-between">
                <Link href={`/fundraiser/${id}`} className="flex-1 mr-2">
                  <Button
                    variant="outline"
                    className="w-full border border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white transition-all duration-300"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>

                <div className="flex space-x-2">
                  <Link href={`/fundraiser/manage?id=${id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpen(true)}
                    className="h-9 w-9 border border-[#bd0e2b]/30 text-[#bd0e2b] hover:bg-[#bd0e2b]/10 hover:text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleLaunch}
                variant="secondary"
                className="w-full "
              >
                <Rocket className="h-4 w-4 mr-2" />
                {launchIsLoading ? "Launching..." : " Launch Fundraiser"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default UserFundraiserCard;
