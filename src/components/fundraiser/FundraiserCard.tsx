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
import { Clock, Users, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface FundraiserCardProps {
  _id?: string;
  title?: string;
  description?: string;
  goalAmount?: number;
  currentAmount?: number;
  isFundRaisedStartedDate?: string;
  category?: string;
  isTotalDonor?: number;
  imageUrl?: string;
}

const FundraiserCard = ({
  _id = "",
  title = "",
  description = "",
  goalAmount = 0,
  currentAmount = 0,
  isFundRaisedStartedDate = "",
  category = "",
  isTotalDonor = 0,
  imageUrl = "",
}: FundraiserCardProps) => {
  const progressPercentage = Math.min(
    Math.round((currentAmount / goalAmount) * 100),
    100
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative group h-[400px]"
    >
      <Card className="border-[#7b7b7b] relative bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white border overflow-hidden rounded-xl z-10 h-full flex flex-col">
        <div className="h-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2f] via-transparent to-transparent z-10"></div>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            height={1000}
            width={1000}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
          />

          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-[#bd0e2b]/80 font-rajdhani backdrop-blur-sm border border-[#f2bd74]/30 text-white hover:bg-[#bd0e2b]">
              {category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-bold font-rajdhani line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74]">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm mt-1 text-gray-300">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2 flex-grow">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#f2bd74]">
                  {formatCurrency(currentAmount)} raised
                </span>
                <span className="text-gray-400">
                  of {formatCurrency(goalAmount)}
                </span>
              </div>

              <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="mt-2 flex items-center">
                <Zap className="h-3 w-3 text-[#f2bd74] mr-1" />
                <span className="text-xs font-medium text-gray-300">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>

            {/* Stats with enhanced styling */}
            <div className="flex items-center justify-between text-xs text-gray-400 bg-[#0a1a2f]/50 p-2 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#f2bd74]" />
                <span>{getTimeSince(isFundRaisedStartedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-[#f2bd74]" />
                <span>{isTotalDonor} donors</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 mt-auto">
          <Button asChild className="w-full" variant={"secondary"}>
            <Link
              href={`/fundraiser/${_id}`}
              className="flex items-center justify-center"
            >
              View Fundraiser
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FundraiserCard;
