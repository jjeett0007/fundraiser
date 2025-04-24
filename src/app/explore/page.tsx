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
import { Clock, Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import FundraiserCard from "@/components/fundraiser/FundraiserCard";

export default function ExplorePage() {
  // Mock data for fundraisers
  const fundraisers = [
    {
      id: "1",
      title: "Medical Emergency Support",
      description:
        "Help with urgent medical expenses for life-saving treatment needed immediately.",
      goalAmount: 5000,
      amountRaised: 2750,
      createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
      category: "Medical",
      imageUrl:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    },
    {
      id: "2",
      title: "Family Crisis Relief",
      description:
        "Supporting a family who lost everything in a house fire last night.",
      goalAmount: 10000,
      amountRaised: 4200,
      createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
      category: "Family",
      imageUrl:
        "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&q=80",
    },
    {
      id: "3",
      title: "Urgent Bill Assistance",
      description:
        "Help prevent utilities from being shut off for a vulnerable elderly couple.",
      goalAmount: 1500,
      amountRaised: 950,
      createdAt: new Date(Date.now() - 3600000 * 24), // 24 hours ago
      category: "Urgent Bill",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    },
    {
      id: "4",
      title: "Disaster Recovery Fund",
      description:
        "Supporting recovery efforts after the recent natural disaster in our community.",
      goalAmount: 25000,
      amountRaised: 15750,
      createdAt: new Date(Date.now() - 3600000 * 36), // 36 hours ago
      category: "Crisis",
      imageUrl:
        "https://images.unsplash.com/photo-1498354178607-a79df2916198?w=800&q=80",
    },
    {
      id: "5",
      title: "Emergency Pet Surgery",
      description:
        "Help fund a life-saving surgery for a beloved pet with no insurance coverage.",
      goalAmount: 3500,
      amountRaised: 2100,
      createdAt: new Date(Date.now() - 3600000 * 8), // 8 hours ago
      category: "Medical",
      imageUrl:
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80",
    },
    {
      id: "6",
      title: "Temporary Housing Need",
      description:
        "Providing temporary shelter for a family displaced by unforeseen circumstances.",
      goalAmount: 4500,
      amountRaised: 1800,
      createdAt: new Date(Date.now() - 3600000 * 18), // 18 hours ago
      category: "Family",
      imageUrl:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    },
    {
      id: "7",
      title: "Emergency Vehicle Repair",
      description:
        "Help a single parent fix their car to continue getting to work and supporting their family.",
      goalAmount: 2000,
      amountRaised: 850,
      createdAt: new Date(Date.now() - 3600000 * 10), // 10 hours ago
      category: "Transportation",
      imageUrl:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    },
    {
      id: "8",
      title: "Critical Medication Fund",
      description:
        "Support needed for life-sustaining medication that insurance won't fully cover.",
      goalAmount: 1200,
      amountRaised: 600,
      createdAt: new Date(Date.now() - 3600000 * 15), // 15 hours ago
      category: "Medical",
      imageUrl:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    },
    {
      id: "9",
      title: "Emergency Food Relief",
      description:
        "Providing emergency food assistance to families affected by recent job losses.",
      goalAmount: 3000,
      amountRaised: 1250,
      createdAt: new Date(Date.now() - 3600000 * 20), // 20 hours ago
      category: "Food",
      imageUrl:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    },
  ];

  // Categories for filtering
  const categories = [
    "All",
    "Medical",
    "Family",
    "Crisis",
    "Urgent Bill",
    "Transportation",
    "Food",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Explore Fundraisers
        </h1>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search fundraisers..."
                className="pl-10 bg-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className={category === "All" ? "bg-[#29339B]" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Fundraisers Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:flex container justify-center lg:gap-8 flex-wrap mx-auto items-center">
          {fundraisers.map((fundraiser) => (
            <FundraiserCard key={fundraiser.id} {...fundraiser} createdAt={fundraiser.createdAt.toISOString()} />
          ))}
        </div>

        {/* Start Your Own Fundraiser CTA */}
        <div className="mt-16 bg-[#FEC601] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Need Help With an Emergency?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-800">
            Start your own fundraiser and get the support you need in minutes.
          </p>
          <Link href="/fundraiser/create">
            <Button className="bg-[#FF3A20] hover:bg-[#e02e17] text-white text-lg py-6 px-8 rounded-xl">
              Start Your Fundraiser
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
