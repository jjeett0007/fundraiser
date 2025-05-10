import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { getCategoryByName } from "@/utils/list";

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
    <Card className="w-full  h-[400px] overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {title}
          </CardTitle>
          <Badge
            className={`capitalize ${getCategoryByName(category)?.bgColor || "bg-gray-800"} ${
              getCategoryByName(category)?.textColor || "text-gray-800"
            }`}
          >
            {category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm mt-1">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">
                {formatCurrency(currentAmount)} raised
              </span>
              <span className="text-muted-foreground">
                of {formatCurrency(goalAmount)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeSince(isFundRaisedStartedDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{isTotalDonor} donors</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/fundraiser/${_id}`}>View Fundraiser</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FundraiserCard;
