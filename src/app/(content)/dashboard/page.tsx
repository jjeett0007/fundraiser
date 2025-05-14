"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Calendar,
  Edit,
  Heart,
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import { useAppDispatch } from "@/store/hooks";
import { setData } from "@/store/slice/userDataSlice";

export default function DashboardPage() {
  const userData = useSelector((state: RootState) => state.userData);
  const { toast } = useToast();

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUpload, setAvatarUpload] = useState("");
  const dispatch = useAppDispatch();

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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Upload Error",
        description: "Please select an image file to upload",
      });
      return;
    }

    setAvatarLoading(true);

    try {
      const base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const uploadResponse = await apiRequest("POST", "/upload/file", {
        file: base64String,
      });

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || "Failed to upload image");
      }

      setAvatar(base64String);
      setAvatarUpload(uploadResponse.data);

      const payload = {
        profileInfo: {
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          displayName: userData.profile.displayName,
        },
        avatar: uploadResponse.data,
        address: {
          country: userData.address?.country,
          state: userData.address?.state,
          city: userData.address?.city,
        },
      };

      const response = await apiRequest("PATCH", "/user", payload);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || "Avatar updated successfully",
        });
        const res = await apiRequest("GET", "/user");
        dispatch(setData({ ...res.data }));
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        variant: "destructive",
        description: error.message || "Failed to update avatar",
      });

      setAvatar(null);
      setAvatarUpload("");
    } finally {
      setAvatarLoading(false);
    }
  };

  const userProfile = {
    memberSince: "March 2023",
    totalRaised: "$6,950",
    totalDonations: 14,
  };

  return (
    <main className="container mx-auto mb-8 px-4 md:px-10 lg:px-14 py-6 ">
      <div className="flex justify-between items-center my-6 md:mt-4 ">
        <h2 className="md:text-2xl text-xl font-rajdhani font-bold text-[#f2bd74]">
          Profile Info
        </h2>
        <EditProfile />
      </div>
      <div className="mt-6 md:mt-10 bg-primary border border-white/20 rounded-lg p-4 flex items-start flex-col md:flex-row md:items-center lg:items-start gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border border-primaryGold overflow-hidden">
            <Image
              src={
                avatar || userData.profileImages.avatar || "/placeholder.svg"
              }
              alt={userData.profile.displayName}
              width={112}
              height={112}
              className="object-cover"
            />
          </div>

          {avatarLoading ? (
            <div className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary border border-primaryGold rounded-full shadow-md">
              <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
            </div>
          ) : (
            <div className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary border border-primaryGold rounded-full shadow-md">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                className="hidden"
                id="avatarUpload"
                onChange={handleImageChange}
              />
              <label htmlFor="avatarUpload" className="cursor-pointer">
                <Edit className="h-4 w-4 text-primaryGold" />
              </label>
            </div>
          )}
        </div>

        <div className="w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center md:gap-2">
              <h2 className="text-2xl font-bold font-rajdhani">
                {userData.profile.firstName} {userData.profile.lastName}
              </h2>

              <div className="p-2.5 py-0.5 rounded-full bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10">
                <span className="text-sm">@{userData.profile.displayName}</span>
              </div>
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

          <div className="mt-10 md:mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10">
              <p className="text-sm opacity-80">Member Since</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <p className="font-bold">{userProfile.memberSince}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10">
              <p className="text-sm opacity-80">Total Fundraisers</p>
              <div className="flex items-center gap-2 mt-1">
                <Heart className="h-4 w-4" />
                <p className="font-bold">{userFundraisers.length}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10 col-span-2 md:col-span-1">
              <p className="text-sm opacity-80">Total Raised</p>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-4 w-4" />
                <p className="font-bold">{userProfile.totalRaised}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 mb-6">
        <h2 className="md:text-2xl text-xl font-rajdhani font-bold text-[#f2bd74]">
          Explore Fundraisers
        </h2>
        <Link href="/fundraiser/create">
          <Button size={"sm"}>
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
