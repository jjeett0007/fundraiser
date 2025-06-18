import React from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  daysAgo: string;
  image: string;
}

const BlogHomeScreen = () => {
  const posts = [
    {
      id: "1",
      title:
        "Seed Funding Trends: What Early-Stage Startups Need to Know in 2025",
      excerpt:
        "Analysis of current seed funding landscape, average deal sizes, and key investor expectations for tech startups...",
      category: "Fundraising",
      daysAgo: "2-15-25",
      image: "/placeholder.svg",
    },
    {
      id: "2",
      title: "Series A Crunch: How to Navigate the Funding Gap",
      excerpt:
        "Strategies for startups facing the Series A funding challenge, including alternative financing options and investor readiness...",
      category: "Venture Capital",
      daysAgo: "1-28-25",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      title: "AI Startups Dominate Q4 2024 Funding Rounds",
      excerpt:
        "Deep dive into how artificial intelligence companies raised over $2.8B in the last quarter, with key insights for founders...",
      category: "Market Analysis",
      daysAgo: "1-10-25",
      image: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Due Diligence Checklist: Preparing for Investor Meetings",
      excerpt:
        "Essential documents and metrics every startup founder should have ready before meeting potential investors...",
      category: "Startup Guide",
      daysAgo: "12-18-24",
      image: "/placeholder.svg",
    },
    {
      id: "5",
      title: "Alternative Funding: Revenue-Based Financing vs Traditional VC",
      excerpt:
        "Comparing RBF, crowdfunding, and other non-dilutive funding options with traditional venture capital for growing businesses...",
      category: "Finance",
      daysAgo: "12-05-24",
      image: "/placeholder.svg",
    },
    {
      id: "6",
      title: "Women-Led Startups See 40% Increase in Funding",
      excerpt:
        "Positive trends in diversity funding with spotlight on successful female founders and supportive investor networks...",
      category: "Diversity & Inclusion",
      daysAgo: "11-22-24",
      image: "/placeholder.svg",
    },
  ];

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

  const PostCard = ({ id, title, excerpt, category, daysAgo, image }: Post) => (
    <Link
      href={id}
      className="bg-primary border border-[#f2bd74]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
          <Image
            width={1000}
            height={1000}
            alt="blog_img"
            src={image || "/placeholder.svg"}
            priority
            className="w-full h-full flex items-center justify-center relative object-cover"
          />
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
              <span className="text-primaryGold px-2 rounded-full bg-[#f2bd74]/10 border border-[#f2bd74]/60 font-rajdhani font-medium text-sm">
                {category}
              </span>
              <div className="flex items-center text-[#ccc] text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {getTimeSince(daysAgo)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      <div className="backdrop-blur-sm relative overflow-hidden bg-gradient-to-r from-[#bd0e2b]/10 to-[#f2bd74]/10  shadow-sm">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-rajdhani font-bold text-white">
            RECENT UPDATES
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid-cols-1 items-center grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <PostCard
              key={index}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              daysAgo={post.daysAgo}
              image={post.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogHomeScreen;
