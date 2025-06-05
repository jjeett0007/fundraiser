"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FundraiserCard from "@/components/fundraiser/FundraiserCard";
import { FundraiserData, PaginationData } from "@/utils/type";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import PaginationComp from "@/components/customs/PaginationComp";
import apiRequest from "@/utils/apiRequest";
import { categories } from "@/utils/list";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  const { toast } = useToast();

  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
  });
  const [fundraisers, setFundraisers] = useState<FundraiserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
      fetchExploreFundraisers(newPage, activeCategory);
    }
  };

  const fetchExploreFundraisers = async (
    page: number = 1,
    category: string = "All"
  ) => {
    setPaginationLoading(true);
    try {
      const url =
        category === "All"
          ? `/fundraise/get-fundraise?page=${page}`
          : `/fundraise/get-fundraise?page=${page}&category=${category}`;

      const response = await apiRequest("GET", url);

      if (response.success) {
        setFundraisers(response.data.results);
        if (response?.data?.pagination) {
          setPaginationData(response.data.pagination);
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        setFundraisers([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fundraisers.",
        variant: "destructive",
      });
      setFundraisers([]);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const initializeData = async () => {
    setLoading(true);
    await Promise.all([
      fetchExploreFundraisers(paginationData.currentPage, activeCategory),
    ]);
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset to page 1 when changing categories
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
    fetchExploreFundraisers(1, category);
  };

  const categoryFilters = [
    "All",
    ...categories.map((category) => category.name),
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8">
        <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
          Explore Fundraisers
        </h2>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex md:items-center items-start flex-col md:flex-row gap-4 mb-4">
            <div className="flex gap-2 border border-primaryGold p-1.5 px-2 w-full md:w-auto  rounded-md items-center ">
              <Search size={15} color={"#ede4d3"} />
              <input
                placeholder="Search fundraisers..."
                className="bg-transparent w-full text-[16px] placeholder:text-sm p-0 m-0 outline-none border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 md:w-auto w-full items-center overflow-x-scroll md:mb-0 mb-2">
              {categoryFilters.map((categoryName, index) => {
                const isActive = categoryName === activeCategory;

                return (
                  <Button
                    key={index}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => handleCategoryChange(categoryName)}
                  >
                    {categoryName}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6 lg:grid-cols-3 justify-center lg:gap-8 flex-wrap mx-auto items-center">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : paginationLoading ? (
          <div className="grid sm:grid-cols-2 gap-6 lg:grid-cols-3 justify-center lg:gap-8 flex-wrap mx-auto items-center">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : fundraisers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No fundraisers found</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-6 lg:grid-cols-3 justify-center lg:gap-8 flex-wrap mx-auto items-center">
              {fundraisers.map((fundraiser, index) => (
                <FundraiserCard
                  key={index}
                  _id={fundraiser._id}
                  title={fundraiser.fundMetaData.title}
                  description={fundraiser.fundMetaData.description}
                  goalAmount={fundraiser.fundMetaData.goalAmount}
                  currentAmount={fundraiser.statics.totalRaised}
                  isFundRaisedStartedDate={fundraiser.isFundRaisedStartedDate}
                  category={fundraiser.fundMetaData.category}
                  isTotalDonor={fundraiser.statics.totalDonor}
                  imageUrl={fundraiser.fundMetaData.imageUrl}
                />
              ))}
            </div>

            {fundraisers.length > 0 && (
              <div className="mt-8 flex justify-center">
                {paginationLoading ? (
                  <Skeleton className="h-10 w-60" />
                ) : (
                  <PaginationComp
                    currentPage={paginationData.currentPage}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </>
        )}

        <section className="text-center p-8 mx-4 md:mx-10 lg:mx-14 my-12 rounded-xl bg-gradient-to-r from-[#bd0e2b]/10 to-[#f2bd74]/10 border border-[#f2bd74]/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>

          <h2 className="text-2xl font-rajdhani font-bold mb-6 text-[#f2bd74] relative z-10">
            Need Help With an Emergency?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-white">
            Start your own fundraiser and get the support you need in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/fundraiser/create">
              <Button size={"lg"}>Start Your Fundraiser</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
