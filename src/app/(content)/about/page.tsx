"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Zap,
  Eye,
  Heart,
  Shield,
  Sparkles,
  Rocket,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-10 lg:px-14 py-12 relative z-10">
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] opacity-5 blur-3xl"></div>

      <h1 className="text-4xl md:text-5xl font-bold font-rajdhani text-center mb-12 text-white ">
        About EmergFund
      </h1>

      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
            Our Mission
          </h2>
          <p className="text-lg text-white/80 mb-6">
            EmergFund was created with a simple but powerful mission: to help
            people get financial support during emergencies when every minute
            counts. We believe that small contributions from many people can
            make a significant difference in someone's life during a crisis.
          </p>
          <p className="text-lg text-white/80">
            Our platform leverages the speed and efficiency of the Solana
            blockchain to ensure that funds reach those in need as quickly as
            possible, without the delays and high fees associated with
            traditional fundraising platforms.
          </p>
        </section>

        <section className="mb-12 p-6 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f2bd74"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M50,10 L50,90 M10,50 L90,50"
                stroke="#f2bd74"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74] flex items-center">
            <Zap className="mr-2 text-[#bd0e2b]" size={20} />
            Mission Statement
          </h2>
          <p className="text-lg text-white/80 italic border-l-4 border-[#bd0e2b] pl-4">
            To make emergency help fast and easy, so anyone, anywhere can give
            or receive support when it matters most.
          </p>
        </section>

        <section className="mb-12 p-6 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,10 90,50 50,90 10,50"
                stroke="#f2bd74"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74] flex items-center">
            <Eye className="mr-2 text-[#f2bd74]" size={20} />
            Vision Statement
          </h2>
          <p className="text-lg text-white/80 italic border-l-4 border-[#f2bd74] pl-4">
            A world where no one has to wait for help in a crisis, where support
            flows as fast as the need arises, powered by people and trust, not
            bureaucracy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74] flex items-center">
            <Heart className="mr-2 text-[#bd0e2b]" size={20} />
            Our Values
          </h2>
          <p className="text-lg text-white/80 mb-6">
            What we believe in and how we show up for others.
          </p>

          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  1
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Urgency with Empathy
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                We move fast because emergencies don't wait. But we never lose
                sight of the human behind the need.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  2
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Radical Simplicity
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                We believe asking for help should be as easy as sending a
                message. No forms. No friction. Just fast, honest support.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  3
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Transparency by Default
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                Trust starts with visibility. Every donation is on-chain,
                trackable, and clear, with no black boxes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  4
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Dignity First
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                We center people, not problems. Everyone deserves to ask for
                help without shame and receive it without judgment.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  5
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Tech for Good
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                We use crypto not because it's trendy, but because it's fast,
                borderless, and fair. Technology should serve people, not the
                other way around.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0a1a2f]/50 border border-[#f2bd74]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#bd0e2b]/50 group">
              <h3 className="text-xl font-rajdhani font-semibold mb-2 text-white flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#bd0e2b]/70 text-white mr-3 group-hover:scale-110 transition-transform">
                  6
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74] group-hover:from-[#bd0e2b] group-hover:to-[#f2bd74] transition-all">
                  Community over Charity
                </span>
              </h3>
              <p className="text-white/80 ml-11">
                We're not here to "save" anyone. We're here to build a system
                where we show up for each other directly and with heart.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">
            How We're Different
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a1a2f]/50 p-6 rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <Rocket className="h-8 w-8 mb-3 text-[#bd0e2b] group-hover:text-[#f2bd74] transition-colors" />
              <h3 className="text-xl font-rajdhani font-semibold mb-3 text-white">
                Instant Transfers
              </h3>
              <p className="text-white/80">
                Contributions go directly to the recipient's wallet with no
                waiting period or withdrawal delays.
              </p>
            </div>

            <div className="bg-[#0a1a2f]/50 p-6 rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <Shield className="h-8 w-8 mb-3 text-[#bd0e2b] group-hover:text-[#f2bd74] transition-colors" />
              <h3 className="text-xl font-rajdhani font-semibold mb-3 text-white">
                Minimal Fees
              </h3>
              <p className="text-white/80">
                We charge only a small platform fee to maintain our services,
                ensuring more of your contribution reaches those in need.
              </p>
            </div>

            <div className="bg-[#0a1a2f]/50 p-6 rounded-xl transition-all duration-300 border border-[#f2bd74]/20 backdrop-blur-sm hover:border-[#bd0e2b]/50 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <Sparkles className="h-8 w-8 mb-3 text-[#bd0e2b] group-hover:text-[#f2bd74] transition-colors" />
              <h3 className="text-xl font-rajdhani font-semibold mb-3 text-white">
                Simple Process
              </h3>
              <p className="text-white/80">
                Create a fundraiser in under 2 minutes and start receiving
                contributions immediately.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-rajdhani font-bold mb-4 text-[#f2bd74]">Our Team</h2>
          <p className="text-lg text-white/80 mb-6">
            EmergFund was founded by a team of blockchain enthusiasts and social
            impact professionals who saw the potential for cryptocurrency to
            revolutionize emergency fundraising.
          </p>
          <p className="text-lg text-white/80">
            Our diverse team brings together expertise in blockchain technology,
            user experience design, and community building to create a platform
            that is both technically robust and easy to use.
          </p>
        </section>

        <section className="text-center p-8 rounded-xl bg-gradient-to-r from-[#bd0e2b]/10 to-[#f2bd74]/10 border border-[#f2bd74]/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 rounded-full blur-xl"></div>

          <h2 className="text-2xl font-rajdhani font-bold mb-6 text-[#f2bd74] relative z-10">
            Ready to Make a Difference?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/fundraiser/create">
              <Button variant={"secondary"} size={"lg"} className="w-full ">
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
  );
}
