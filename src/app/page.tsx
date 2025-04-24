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
import { Clock, Users, ArrowRight } from "lucide-react";
import FundraiserCard from "@/components/fundraiser/FundraiserCard";

export default function HomePage() {
  // Mock data for active fundraisers
  const activeFundraisers = [
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
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#29339B] to-[#3a44b5] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Fast Emergency Fundraising
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Raise and receive emergency funds instantly through small, direct
              contributions. When every minute counts, we make it simple to get
              the help you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/fundraiser/create">
                <Button className="w-full sm:w-auto bg-[#FF3A20] hover:bg-[#e02e17] text-white text-lg py-6 px-8 rounded-xl">
                  Start Fundraiser
                </Button>
              </Link>
              <Link href="/explore">
                <Button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#29339B] text-lg py-6 px-8 rounded-xl">
                  Give Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-14">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#FEC601] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Create a Fundraiser
              </h3>
              <p className="text-gray-600">
                Set up your emergency fundraiser in less than 2 minutes with
                just a few details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#D72483] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Link</h3>
              <p className="text-gray-600">
                Share your fundraiser link or QR code with friends, family, and
                social networks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#29339B] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Receive Funds Instantly
              </h3>
              <p className="text-gray-600">
                Get USDC and SOL contributions directly to your Solana wallet
                with no delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Fundraisers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-10 lg:px-14">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Active Fundraisers
            </h2>
            <Link
              href="/explore"
              className="text-[#29339B] hover:text-[#1e2575] font-medium flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:flex container justify-center lg:gap-8 flex-wrap mx-auto items-center">
            {activeFundraisers.map((fundraiser) => (
              <FundraiserCard key={fundraiser.id} {...fundraiser} createdAt={fundraiser.createdAt.toISOString()} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEC601]">
        <div className="container mx-auto px-4 md:px-10 lg:px-14 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-800">
            Whether you need help or want to give help, you can make an impact
            in just a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/fundraiser/create">
              <Button className="w-full sm:w-auto bg-[#FF3A20] hover:bg-[#e02e17] text-white text-lg py-6 px-8 rounded-xl">
                Start Fundraiser
              </Button>
            </Link>
            <Link href="/explore">
              <Button className="w-full sm:w-auto bg-[#29339B] hover:bg-[#1e2575] text-white text-lg py-6 px-8 rounded-xl">
                Explore Fundraisers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
