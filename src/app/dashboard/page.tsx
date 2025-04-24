"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export default function DashboardPage() {
  // Mock data for user's fundraisers
  // In a real app, this would come from an API or database
  const [userFundraisers, setUserFundraisers] = useState([
    {
      id: "1",
      title: "Medical Emergency Support",
      description:
        "Help with urgent medical expenses for life-saving treatment needed immediately.",
      goalAmount: 5000,
      amountRaised: 2750,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
      category: "Medical",
      imageUrl:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
      status: "active",
    },
    {
      id: "2",
      title: "Family Crisis Relief",
      description:
        "Supporting a family who lost everything in a house fire last night.",
      goalAmount: 10000,
      amountRaised: 4200,
      createdAt: new Date(Date.now() - 3600000 * 24 * 5), // 5 days ago
      category: "Family",
      imageUrl:
        "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&q=80",
      status: "active",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 lg:px-14">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Fundraisers</h1>
          <Link href="/fundraiser/create">
            <Button className="bg-[#29339B] hover:bg-[#1e2575] text-white">
              <Plus className="mr-2 h-4 w-4" /> Create New Fundraiser
            </Button>
          </Link>
        </div>

        {userFundraisers.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              You haven't created any fundraisers yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start your first emergency fundraiser in just a few minutes.
            </p>
            <Link href="/fundraiser/create">
              <Button className="bg-[#29339B] hover:bg-[#1e2575] text-white">
                <Plus className="mr-2 h-4 w-4" /> Create New Fundraiser
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {userFundraisers.map((fundraiser) => (
              <Card key={fundraiser.id} className="overflow-hidden bg-white">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={fundraiser.imageUrl}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${fundraiser.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                  >
                    {fundraiser.status === "active" ? "Active" : "Ended"}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {fundraiser.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(fundraiser.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge>{fundraiser.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        ${fundraiser.amountRaised} raised
                      </span>
                      <span className="text-sm font-medium">
                        ${fundraiser.goalAmount} goal
                      </span>
                    </div>
                    <Progress
                      value={
                        (fundraiser.amountRaised / fundraiser.goalAmount) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/fundraiser/${fundraiser.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                  <div className="flex space-x-2">
                    <Link href={`/fundraiser/manage?id=${fundraiser.id}`}>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
