"use client";

import { ChangeEvent, useState, useEffect } from "react";
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
import { PaginationData, FundraiserData } from "@/utils/type";
import PaginationComp from "@/components/customs/PaginationComp";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const userData = useSelector((state: RootState) => state.userData);
  const { toast } = useToast();

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUpload, setAvatarUpload] = useState("");
  const dispatch = useAppDispatch();

  const [userFundraisers, setUserFundraisers] = useState<FundraiserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
  });

  const fetchExploreFundraisers = async (page: number = 1) => {
    setPaginationLoading(true);
    try {
      const response = await apiRequest("GET", `/fundraise/get?page=${page}`);

      if (response.success) {
        setUserFundraisers(response.data.results);
        if (response?.data?.pagination) {
          setPaginationData(response.data.pagination);
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        setUserFundraisers([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fundraisers.",
        variant: "destructive",
      });
      setUserFundraisers([]);
    } finally {
      setPaginationLoading(false);
      setLoading(false);
    }
  };

  const initializeData = async () => {
    setLoading(true);
    await Promise.all([fetchExploreFundraisers(paginationData.currentPage)]);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      initializeData();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
      fetchExploreFundraisers(newPage);
    }
  };

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
      setAvatarUpload(uploadResponse.data.link);

      const payload = {
        profileInfo: {
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          displayName: userData.profile.displayName,
        },
        avatar: uploadResponse.data.link,
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

  function formatDateToMonthYear(isoDateString: string): string {
    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string provided");
    }

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          {loading ? (
            <Skeleton className="w-28 h-28 rounded-full" />
          ) : (
            <div className="w-28 h-28 rounded-full border border-primaryGold overflow-hidden">
              <Image
                src={
                  avatar || userData.profileImages.avatar || "/placeholder.svg"
                }
                alt={userData.profile.displayName}
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {avatarLoading ? (
            <div className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary border border-primaryGold rounded-full shadow-md">
              <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
            </div>
          ) : (
            !loading && (
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
            )
          )}
        </div>

        <div className="w-full text-center md:text-left">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mt-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center md:gap-2">
                  <h2 className="text-2xl font-bold font-rajdhani">
                    {userData.profile.firstName} {userData.profile.lastName}
                  </h2>

                  <div className="p-2.5 py-0.5 rounded-full bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10">
                    <span className="text-sm">
                      @{userData.profile.displayName}
                    </span>
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
                      ? `${userData.address?.city || ""} ${
                          userData.address?.state || ""
                        }${
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
                    <p className="font-bold">
                      {formatDateToMonthYear(userData?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10">
                  <p className="text-sm opacity-80">Total Fundraisers</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Heart className="h-4 w-4" />
                    <p className="font-bold">
                      {userData.statics?.totalFundRaiseCreated || 0}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border flex items-center justify-center flex-col border-white/10 col-span-2 md:col-span-1">
                  <p className="text-sm opacity-80">Total Raised</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-4 w-4" />
                    <p className="font-bold">
                      {formatCurrency(userData.statics?.totalRaised) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 mb-6">
        <h2 className="md:text-2xl text-xl font-rajdhani font-bold text-[#f2bd74]">
          My Fundraisers
        </h2>
        <Link href="/fundraiser/create">
          <Button size={"sm"}>
            <Plus className="mr-2 h-4 w-4" /> Create Fundraiser
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-96 w-full rounded-lg" />
          ))}
        </div>
      ) : userFundraisers.length === 0 ? (
        <div className="text-center py-16 bg-primary rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            You haven't created any fundraisers yet
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Start your first emergency fundraiser in just a few minutes.
          </p>
          <Link href="/fundraiser/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Fundraiser
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {paginationLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-96 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userFundraisers.map((fundraiser, index) => (
                <UserFundraiserCard
                  key={index}
                  id={fundraiser._id}
                  title={fundraiser.fundMetaData.title}
                  description={fundraiser.fundMetaData.description}
                  createdAt={fundraiser.isFundRaisedStartedDate}
                  category={fundraiser.fundMetaData.category}
                  goalAmount={fundraiser.fundMetaData.goalAmount}
                  amountRaised={fundraiser.statics.totalRaised}
                  imageUrl={fundraiser.fundMetaData.imageUrl}
                  isFundRaiseVerified={fundraiser.verify.isFundRaiseVerified}
                  updatedResponse={initializeData}
                  totalRaised={fundraiser.statics.totalRaised}
                  totalDonor={fundraiser.statics.totalDonor}
                  averageDonation={fundraiser.statics.averageDonation}
                  largestAmount={fundraiser.statics.largestAmount}
                  isFundRaiseDeactivated={fundraiser.isFundRaiseDeactivated}
                  isFundRaiseEnded={fundraiser.isFundRaiseEnded}
                  isFundRaiseStarted={fundraiser.isFundRaiseStarted}
                  isFundRaiseActive={fundraiser.isFundRaiseActive}
                  isFundRaisedStopped={fundraiser.isFundRaisedStopped}
                />
              ))}
            </div>
          )}
          {!loading && userFundraisers && userFundraisers.length > 0 && (
            <div className="mt-8 flex justify-center">
              <PaginationComp
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
