"use client";

import React, { useState, useEffect } from "react";
import { Clock, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import apiRequest from "@/utils/apiRequest";
import { PaginationData } from "@/utils/type";
import PaginationComp from "@/components/customs/PaginationComp";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  featuredImage: {
    file: string;
  };
  views: number;
}

const BlogHomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
  });
  const [paginationLoading, setPaginationLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
      fetchPosts(newPage);
    }
  };
  const fetchPosts = async (page: number = 1) => {
    setLoading(true);
    setPaginationLoading(true);

    try {
      const response = await apiRequest("GET", `/blog?page=${page}`);

      if (response.success) {
        setPosts(response.data?.results || []);
        if (response?.data?.pagination) {
          setPaginationData(response.data.pagination);
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        setPosts([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts.",
        variant: "destructive",
      });
      setPosts([]);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const initializeData = async () => {
    setLoading(true);
    await Promise.all([fetchPosts(paginationData.currentPage)]);
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

  const PostCard = ({
    slug,
    title,
    excerpt,
    category,
    createdAt,
    featuredImage,
    views,
  }: Post) => (
    <Link
      href={`/blogs/${slug}`}
      className="bg-primary border border-[#f2bd74]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48  relative overflow-hidden">
          <Image
            width={1000}
            height={1000}
            alt="blog_img"
            src={featuredImage.file || "/placeholder.svg"}
            priority
            className="w-full h-full flex items-center justify-center relative object-cover"
          />
          <span className="text-white absolute top-2 left-2 flex gap-1 items-center px-2 rounded-full bg-[#6f4812d0] border border-[#fff]/60 font-rajdhani font-medium text-sm">
            <EyeIcon size={12} />
            {views}
          </span>
        </div>
        <div className="flex-1 p-3 md:p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h2 className="text-xl font-rajdhani font-bold text-white mb-3 line-clamp-1">
                {title}
              </h2>
              <p className="text-[#cacaca] text-sm mb-4 line-clamp-2">
                {excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-2 items-center">
                <span className="text-primaryGold px-2 rounded-full bg-[#f2bd74]/10 border border-[#f2bd74]/60 font-rajdhani font-medium text-sm">
                  {category}
                </span>
              </div>

              <div className="flex items-center text-[#ccc] text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {getTimeSince(createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const LoadingSkeleton = () => (
    <div className="bg-primary border border-[#f2bd74]/20 rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="md:w-1/3 h-48 md:h-auto" />
        <div className="flex-1 p-3 md:p-6">
          <Skeleton className="h-6 rounded w-3/4 mb-3" />
          <Skeleton className="h-4 rounded w-full mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 rounded w-20" />
            <Skeleton className="h-4 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="backdrop-blur-sm relative overflow-hidden bg-gradient-to-r from-[#bd0e2b]/10 to-[#f2bd74]/10 shadow-sm">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-rajdhani font-bold text-white">
            RECENT UPDATES
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid-cols-1 items-center grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid-cols-1 items-center grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <PostCard
                key={index}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                createdAt={post.createdAt}
                featuredImage={post.featuredImage}
                views={post.views}
              />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#cacaca] text-lg">No blog posts found.</p>
          </div>
        )}

        {posts.length > 0 && (
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
      </div>
    </div>
  );
};

export default BlogHomeScreen;
