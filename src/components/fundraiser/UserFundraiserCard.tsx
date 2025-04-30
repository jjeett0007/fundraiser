import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

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
    <Card className="overflow-hidden bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-4 right-4 ${status === "active" ? "bg-green-500" : "bg-gray-500"}`}
        >
          {status === "active" ? "Active" : "Ended"}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {createdAt}
            </CardDescription>
          </div>
          <Badge className={`${getCategoryColor(category)}`}>{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">${amountRaised} raised</span>
            <span className="text-sm font-medium">${goalAmount} goal</span>
          </div>
          <Progress value={(amountRaised / goalAmount) * 100} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <div className="border w-full rounded-lg flex flex-col gap-2  ">
          <div className="flex justify-between p-2">
            <Link href={`/fundraiser/${id}`}>
              <Button variant="outline">View Details</Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/fundraiser/manage?id=${id}`}>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="destructive" size="icon" className="h-9 w-9">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="">
            <Button className="w-full">Launch</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserFundraiserCard;
