"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Calendar,
  Edit,
  Heart,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserFundraiserCard from "@/components/fundraiser/UserFundraiserCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import EditProfile from "./components/EditProfile";

export default function DashboardPage() {
  const userData = useSelector((state: RootState) => state.userData);

  const [userFundraisers, setUserFundraisers] = useState([
    {
      id: "1",
      title: "Medical Emergency Support",
      description:
        "Help with urgent medical expenses for life-saving treatment needed immediately.",
      goalAmount: 5000,
      amountRaised: 2750,
      createdAt: "3 days ago",
      category: "Medical",
      imageUrl:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
      status: "active",
      donors: 42,
    },
    {
      id: "2",
      title: "Family Crisis Relief",
      description:
        "Supporting a family who lost everything in a house fire last night.",
      goalAmount: 10000,
      amountRaised: 4200,
      createdAt: "5 days ago",
      category: "Family",
      imageUrl:
        "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&q=80",
      status: "ended",
      donors: 78,
    },
  ]);

  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    memberSince: "March 2023",
    totalRaised: "$6,950",
    totalDonations: 14,
  };

  return (
    <main className="container mx-auto px-4 md:px-10 lg:px-14 py-6 ">
      <div className="mb-8 relative rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground overflow-hidden shadow-md">
        <EditProfile />
        <div className="p-6 md:p-8 pt-6 md:pt-10 flex items-start flex-col md:flex-row md:items-center lg:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-white overflow-hidden">
              <Image
                src={userData.profileImages.avatar || "/placeholder.svg"}
                alt={userData.profile.displayName}
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center md:gap-2">
                <h2 className="text-2xl font-bold">
                  {userData.profile.firstName} {userData.profile.lastName}
                </h2>

                <span className="text-sm">@{userData.profile.displayName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-6 w-6 rounded-full border p-1" />
                <span className="text-sm">{userData.email}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="h-6 w-6 rounded-full border p-1" />
                <span className="text-sm">
                  {userData.address?.city ||
                  userData.address?.state ||
                  userData.address?.country
                    ? `${userData.address?.city || ""} ${userData.address?.state || ""}${
                        userData.address?.country
                          ? `, ${userData.address.country}`
                          : ""
                      }`
                        .trim()
                        .replace(/\s+,/, ",")
                    : "No Address"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/20 rounded-lg p-3 flex flex-col items-start">
                <p className="text-sm opacity-80">Member Since</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <p className="font-bold">{userProfile.memberSince}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 flex flex-col items-start">
                <p className="text-sm opacity-80">Total Fundraisers</p>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="h-4 w-4" />
                  <p className="font-bold">{userFundraisers.length}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 flex flex-col items-start">
                <p className="text-sm opacity-80">Total Raised</p>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4" />
                  <p className="font-bold">{userProfile.totalRaised}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Fundraisers</h2>
        <Link href="/fundraiser/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Fundraiser
          </Button>
        </Link>
      </div>

      {userFundraisers.length === 0 ? (
        <div className="text-center py-16 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            You haven't created any fundraisers yet
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start your first emergency fundraiser in just a few minutes.
          </p>
          <Link href="/fundraiser/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Fundraiser
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFundraisers.map((fundraiser, index) => (
            <UserFundraiserCard
              key={index}
              id={fundraiser.id}
              title={fundraiser.title}
              createdAt={fundraiser.createdAt}
              category={fundraiser.category}
              goalAmount={fundraiser.goalAmount}
              amountRaised={fundraiser.amountRaised}
              imageUrl={fundraiser.imageUrl}
              status={fundraiser.status}
            />
          ))}
        </div>
      )}
    </main>
  );
}
