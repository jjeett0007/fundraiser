"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import FundraiserCard from "@/components/fundraiser/FundraiserCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import landingBg from "@/assets/landing_bg.png";
import AnimatedWord from "@/components/common/animated-word";

export default function HomePage() {
  const router = useRouter();

  const activeFundraisers = [
    {
      id: "1",
      title: "Medical Emergency Support",
      description:
        "Help with urgent medical expenses for life-saving treatment needed immediately.",
      goalAmount: 5000,
      amountRaised: 2750,
      createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
      category: "medical",
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
      category: "family",
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
      category: "urgent bills",
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
      category: "crisis",
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
      category: "medical",
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
      category: "family",
      imageUrl:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    },
  ];

  const [disable, setDisable] = useState(true);

  // useEffect(() => {
  //   router.push("/wait-list");
  // });

  return (
    <>
      {disable && (
        <>
          <div className="min-h-screen bg-white">
            <section className="relative min-h-[100dvh] bg-primary text-white py-16 md:py-24 overflow-hidden">
              {/* Grid Pattern Overlay */}
              <Image
                alt=""
                height={1000}
                width={1000}
                className="absolute right-0 left-0 bottom-0 bg-top object-cover w-full h-[50vh] opacity-30"
                priority
                src={landingBg}
              />
              <div className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(12)].map((_, i) => (
                    <div key={`h-${i}`} className="w-full h-px bg-white"></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-row justify-between">
                  {[...Array(12)].map((_, i) => (
                    <div key={`v-${i}`} className="h-full w-px bg-white"></div>
                  ))}
                </div>
              </div>

              {/* Content Container */}
              <div className="container pt-[4rem] mx-auto px-4 md:px-10 lg:px-14 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  {/* Badge */}
                  <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-white text-sm font-medium">
                      Powered by Solana
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl md:text-5xl font-rajdhani font-extrabold md:font-extrabold mb-6 leading-tight">
                    <span className="text-primaryGold">Instant</span>{" "}
                    fundraising for{" "}
                    <AnimatedWord
                      words={[
                        "medical",
                        "business",
                        "family",
                        "school",
                        "hospital",
                        "community",
                      ]}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3A20] to-[#FF8E20]"
                    />{" "}
                    Emergencies{" "}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl mb-10 text-white/90">
                    Every minutes counts, get the help you need.
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col  sm:flex-row justify-center gap-4">
                    <Link href="/fundraiser/create">
                      <Button
                        variant={"secondary"}
                        size={"lg"}
                        className="w-full sm:w-auto"
                      >
                        Start Fundraiser
                      </Button>
                    </Link>
                    <Link href="/explore">
                      <Button size={"lg"} className="w-full sm:w-auto ">
                        Give Help
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <p className="text-2xl md:text-3xl font-bold text-white">
                        $2.5M+
                      </p>
                      <p className="text-sm text-white/70">Funds Raised</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <p className="text-2xl md:text-3xl font-bold text-white">
                        5 min
                      </p>
                      <p className="text-sm text-white/70">Average Time</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 col-span-2 md:col-span-1">
                      <p className="text-2xl md:text-3xl font-bold text-white">
                        10K+
                      </p>
                      <p className="text-sm text-white/70">People Helped</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Dots */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={`dot-${i}`}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `pulse ${2 + Math.random() * 3}s infinite`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Animation Keyframes */}
              <style jsx>{`
                @keyframes pulse {
                  0% {
                    transform: scale(1);
                    opacity: 0.3;
                  }
                  50% {
                    transform: scale(2);
                    opacity: 0.5;
                  }
                  100% {
                    transform: scale(1);
                    opacity: 0.3;
                  }
                }
              `}</style>
            </section>

            <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white relative">
              <div className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(24)].map((_, i) => (
                    <div key={`h-${i}`} className="w-full h-px bg-white"></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-row justify-between">
                  {[...Array(24)].map((_, i) => (
                    <div key={`v-${i}`} className="h-full w-px bg-white"></div>
                  ))}
                </div>
              </div>
              <section className="py-16 ">
                <div className="container mx-auto px-4 md:px-10 lg:px-14">
                  <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
                    How It Works
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#0a1a2f]/50 p-6 flex items-center justify-center flex-col text-center rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="text-xl w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center font-rajdhani font-semibold mb-3 text-white">
                        1
                      </h3>
                      <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
                        Create a Fundraiser
                      </h2>
                      <p className="text-white/80">
                        Set up your emergency fundraiser in less than 2 minutes
                        with just a few details.
                      </p>
                    </div>

                    <div className="bg-[#0a1a2f]/50 p-6 flex items-center justify-center flex-col text-center rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="text-xl w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center font-rajdhani font-semibold mb-3 text-white">
                        2
                      </h3>
                      <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
                        Share Your Link
                      </h2>
                      <p className="text-white/80">
                        Share your fundraiser link or QR code with friends,
                        family, and social networks.
                      </p>
                    </div>

                    <div className="bg-[#0a1a2f]/50 p-6 flex items-center justify-center flex-col text-center rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="text-xl w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center font-rajdhani font-semibold mb-3 text-white">
                        3
                      </h3>
                      <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
                        Receive Funds Instantly
                      </h2>
                      <p className="text-white/80">
                        Get USDC and SOL contributions directly to your Solana
                        wallet with no delays.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="py-16">
                <div className="container mx-auto px-4 md:px-10 lg:px-14">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
                      Active Fundraisers
                    </h2>
                    <Link
                      href="/explore"
                      className="text-white hover:text-primaryGold font-rajdhani flex items-center"
                    >
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6 lg:grid-cols-3  justify-center lg:gap-8 flex-wrap mx-auto items-center">
                    {activeFundraisers.map((fundraiser, index) => (
                      <FundraiserCard key={index} {...fundraiser} />
                    ))}
                  </div>
                </div>
              </section>

              <section className="text-center p-8 mx-4 md:mx-10 lg:mx-14 my-12 rounded-xl bg-gradient-to-r from-[#bd0e2b]/10 to-[#f2bd74]/10 border border-[#f2bd74]/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>

                <h2 className="text-2xl font-rajdhani font-bold mb-6 text-[#f2bd74] relative z-10">
                  Ready to Make a Difference?
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                  <Link href="/fundraiser/create">
                    <Button
                      variant={"secondary"}
                      size={"lg"}
                      className="w-full "
                    >
                      Start Fundraiser
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button size={"lg"} className="w-full ">
                      Explore Fundraisers
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}
