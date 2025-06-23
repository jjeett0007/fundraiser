"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import ContentJsonInterpreter from "@/components/customs/ContentJsonInterpreter";
import apiRequest from "@/utils/apiRequest";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { EyeIcon, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NodeData {
  type: string;
  children?: NodeData[];
  text?: string;
  tag?: string;
  listType?: string;
  start?: number;
  checked?: boolean;
  src?: string;
  altText?: string;
  textFormat?: number;
  textStyle?: string;
  language?: string;
  [key: string]: any;
}

interface ContentJson {
  root: NodeData;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: {
    file: string;
    type: string;
  };
  category: string;
  tags: string[];
  metaDescription: string;
  keywords: string;
  status: string;
  publishNow: boolean;
  contentJson: ContentJson;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const BlogDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const fetchBlogContent = async (slug: string) => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", `/blog/${slug}`);

      if (response.success) {
        setBlogPost(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        setNotFoundError(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog content.",
        variant: "destructive",
      });
      setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    setLoading(true);
    await Promise.all([fetchBlogContent(slug)]);
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <Skeleton className="h-8 rounded w-3/4 mb-4" />
          <Skeleton className="h-[5rem] rounded w-2/4 mb-4" />
          <Skeleton className="h-4 rounded w-full mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-full mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-full mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-full mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
          <Skeleton className="h-4 rounded w-4/6 mb-2" />
          <Skeleton className="h-4 rounded w-5/6 mb-2" />
        </div>
      </div>
    );
  }

  if (notFoundError || !blogPost) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        href="/blogs"
        className="flex mb-4 text-primaryGold items-center gap-2"
      >
        <ArrowLeft /> Back
      </Link>

      <div className="flex items-start gap-3">
        <Image
          width={1000}
          height={1000}
          alt="blog_img"
          src={blogPost.featuredImage.file || "/placeholder.svg"}
          priority
          className="w-[5rem] h-[5rem] rounded-full flex items-center justify-center relative object-cover"
        />
        <div className="flex flex-col w-full items-start gap-1">
          <h1 className="md:text-3xl text-2xl font-rajdhani font-bold mb-2">
            {blogPost.title}
          </h1>
          <div className="flex w-full flex-col gap-1 md:gap-0 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-white  flex gap-1 items-center px-2 rounded-full bg-[#6f4812d0] border border-[#fff]/60 font-rajdhani font-medium text-sm">
                <EyeIcon size={12} />
                {blogPost.views}
              </span>
              <span className="text-primaryGold px-2 rounded-full bg-[#f2bd74]/10 border border-[#f2bd74]/60 font-rajdhani font-medium text-sm">
                {blogPost.category}
              </span>
            </div>
            <div className="flex items-center text-[#ccc] text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {getTimeSince(blogPost.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="font-medium text-primaryGold mt-4 my-2 font-rajdhani">
        #Tags
      </div>
      {blogPost.tags && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {blogPost.tags.map((tag, index) => {
            return (
              <span
                key={index}
                className="text-sm px-1.5 py-0.5 bg-[#8f8f8f52] rounded-full text-gray-300"
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
      <div className="font-medium text-primaryGold mt-4 my-2 font-rajdhani">
        Description
      </div>
      <div className="font-medium pb-4 border-primaryGold border-b">
        {blogPost.metaDescription}
      </div>

      {blogPost.contentJson && blogPost.contentJson.root && (
        <ContentJsonInterpreter contentJson={blogPost.contentJson} />
      )}
    </div>
  );
};

export default BlogDetailPage;
