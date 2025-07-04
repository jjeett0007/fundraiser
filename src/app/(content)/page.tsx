"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import FundraiserCard from "@/components/fundraiser/FundraiserCard";
import { useRouter } from "next/navigation";
import landingBg from "@/assets/landing_bg.png";
import AnimatedWord from "@/components/common/animated-word";
import { FundraiserData } from "@/utils/type";
import apiRequest from "@/utils/apiRequest";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeFundraisers, setActiveFundraisers] = useState<FundraiserData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState(true);

  // useEffect(() => {
  //   router.push("/wait-list");
  // });

  const fetchActiveFundraisers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        "/fundraise/get-fundraise?page=1"
      );
      if (response.success) {
        setActiveFundraisers(response.data.results);
        setLoading(false);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        setActiveFundraisers([]);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const initializeData = async () => {
    setLoading(true);
    await Promise.all([fetchActiveFundraisers()]);
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

  return (
    <>
      {disable && (
        <>
          <div className="min-h-screen bg-white">
            <section className="relative min-h-[100dvh] bg-primary text-white py-16 md:py-24 overflow-hidden">
              <div
                className="absolute right-0 left-0 bottom-0 w-full h-[50vh] lg:h-[80vh] md:h-[60vh] opacity-30"
                style={{
                  backgroundImage: `url(${landingBg.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                }}
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
                        2 min
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
                    <h2 className="text-2xl font-rajdhani font-bold text-[#f2bd74]">
                      Active Fundraisers
                    </h2>
                    <Link
                      href="/explore"
                      className="text-white hover:text-primaryGold font-rajdhani flex items-center"
                    >
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Loading...</p>
                    </div>
                  ) : activeFundraisers.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        No Active fundraisers found
                      </p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6 lg:grid-cols-3  justify-center lg:gap-8 flex-wrap mx-auto items-center">
                      {activeFundraisers
                        .slice(0, 5)
                        .map((fundraiser, index) => (
                          <FundraiserCard
                            key={index}
                            _id={fundraiser._id}
                            title={fundraiser.fundMetaData.title}
                            description={fundraiser.fundMetaData.description}
                            goalAmount={fundraiser.fundMetaData.goalAmount}
                            currentAmount={fundraiser.statics.totalRaised}
                            isFundRaisedStartedDate={
                              fundraiser.isFundRaisedStartedDate
                            }
                            category={fundraiser.fundMetaData.category}
                            isTotalDonor={fundraiser.statics.totalDonor}
                            imageUrl={fundraiser.fundMetaData.imageUrl}
                          />
                        ))}
                    </div>
                  )}
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
