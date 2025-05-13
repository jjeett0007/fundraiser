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
import { motion } from "framer-motion";
import Image from "next/image";

interface FundraiserCardProps {
  id: string;
  title: string;
  createdAt: string;
  category: string;
  goalAmount: number;
  amountRaised: number;
  imageUrl: string;
  status: string;
}

const UserFundraiserCard = ({
  id,
  title,
  createdAt,
  category,
  goalAmount,
  amountRaised,
  imageUrl,
  status,
}: FundraiserCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const percentRaised = (amountRaised / goalAmount) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative group"
    >
      <Card className="relative border-[#7b7b7b] bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white border overflow-hidden rounded-xl z-10">
        <div className="absolute top-4 right-4 z-20">
          {status === "active" ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white">
                Active
              </Badge>
            </div>
          ) : (
            <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 border-0 text-white">
              Ended
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl rajdhani font-bold line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74]">
                {title}
              </CardTitle>
              <CardDescription className="flex items-center mt-1 text-gray-300">
                <Clock className="h-4 w-4 mr-1 text-[#f2bd74]" />
                {createdAt}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4 mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#f2bd74]">
                {formatCurrency(amountRaised)} raised
              </span>
              <span className="text-sm font-medium text-gray-300">
                {formatCurrency(goalAmount)} goal
              </span>
            </div>

            <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] rounded-full"
                style={{ width: `${Math.min(percentRaised, 100)}%` }}
              />
            </div>

            <div className="mt-2 flex items-center">
              <Zap className="h-4 w-4 text-[#f2bd74] mr-1" />
              <span className="text-xs font-medium text-gray-300">
                {percentRaised.toFixed(0)}% Complete
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
                  className="h-9 w-9 border border-[#bd0e2b]/30 text-[#bd0e2b] hover:bg-[#bd0e2b]/10 hover:text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] hover:from-[#d01232] hover:to-[#f7ca8a] text-white border-0 shadow-lg shadow-[#bd0e2b]/20 font-bold">
              <Rocket className="h-4 w-4 mr-2" />
              Launch Fundraiser
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default UserFundraiserCard;
