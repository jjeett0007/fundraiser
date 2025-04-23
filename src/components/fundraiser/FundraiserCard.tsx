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

interface FundraiserCardProps {
  id?: string;
  title?: string;
  description?: string;
  goalAmount?: number;
  amountRaised?: number;
  createdAt?: string;
  category?: string;
  donorCount?: number;
  imageUrl?: string;
}

const FundraiserCard = ({
  id = "fundraiser-1",
  title = "Medical Emergency Support",
  description = "Help with urgent medical expenses for a life-saving procedure needed immediately.",
  goalAmount = 5000,
  amountRaised = 2750,
  createdAt = "2023-05-15T10:30:00Z",
  category = "Medical",
  donorCount = 42,
  imageUrl = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
}: FundraiserCardProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((amountRaised / goalAmount) * 100),
    100,
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate time since creation
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

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      Medical: "bg-blue-100 text-blue-800",
      Family: "bg-green-100 text-green-800",
      "Urgent Bill": "bg-red-100 text-red-800",
      Crisis: "bg-amber-100 text-amber-800",
      Disaster: "bg-purple-100 text-purple-800",
    };

    return categories[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full max-w-[350px] h-[400px] overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">
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
          <Badge className={`${getCategoryColor(category)}`}>{category}</Badge>
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
                {formatCurrency(amountRaised)} raised
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
              <span>{getTimeSince(createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{donorCount} donors</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <a
          href={`/fundraiser/${id}`}
          className="w-full py-2 px-4 bg-[#29339B] hover:bg-[#222d8a] text-white rounded-lg text-center text-sm font-medium transition-colors"
        >
          View Fundraiser
        </a>
      </CardFooter>
    </Card>
  );
};

export default FundraiserCard;
