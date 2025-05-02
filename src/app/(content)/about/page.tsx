import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Web3 decorative elements */}
     

      <div className="container mx-auto px-4 md:px-10 lg:px-14 py-12 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          About EmergFund
        </h1>

        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-[#29339B]">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              EmergFund was created with a simple but powerful mission: to help
              people get financial support during emergencies when every minute
              counts. We believe that small contributions from many people can
              make a significant difference in someone's life during a crisis.
            </p>
            <p className="text-lg text-gray-700">
              Our platform leverages the speed and efficiency of the Solana
              blockchain to ensure that funds reach those in need as quickly as
              possible, without the delays and high fees associated with
              traditional fundraising platforms.
            </p>
          </section>

          {/* Mission Statement Section */}
          <section className="mb-12 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 relative">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#29339B"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M50,10 L50,90 M10,50 L90,50"
                  stroke="#29339B"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#29339B] flex items-center">
              <Zap className="mr-2 text-[#FF3A20]" size={20} />
              Mission Statement
            </h2>
            <p className="text-lg text-gray-700 italic border-l-4 border-[#FF3A20] pl-4">
              To make emergency help fast and easy, so anyone, anywhere can give
              or receive support when it matters most.
            </p>
          </section>

          {/* Vision Statement Section */}
          <section className="mb-12 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 relative">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,10 90,50 50,90 10,50"
                  stroke="#D72483"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#29339B] flex items-center">
              <Eye className="mr-2 text-[#D72483]" size={20} />
              Vision Statement
            </h2>
            <p className="text-lg text-gray-700 italic border-l-4 border-[#D72483] pl-4">
              A world where no one has to wait for help in a crisis, where
              support flows as fast as the need arises, powered by people and
              trust, not bureaucracy.
            </p>
          </section>

          {/* Our Values Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-[#29339B] flex items-center">
              <Heart className="mr-2 text-[#FEC601]" size={20} />
              Our Values
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              What we believe in and how we show up for others.
            </p>

            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#FF3A20] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF3A20]/10 text-[#FF3A20] mr-3">
                    1
                  </span>
                  Urgency with Empathy
                </h3>
                <p className="text-gray-700 ml-11">
                  We move fast because emergencies don't wait. But we never lose
                  sight of the human behind the need.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#D72483] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D72483]/10 text-[#D72483] mr-3">
                    2
                  </span>
                  Radical Simplicity
                </h3>
                <p className="text-gray-700 ml-11">
                  We believe asking for help should be as easy as sending a
                  message. No forms. No friction. Just fast, honest support.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#29339B] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#29339B]/10 text-[#29339B] mr-3">
                    3
                  </span>
                  Transparency by Default
                </h3>
                <p className="text-gray-700 ml-11">
                  Trust starts with visibility. Every donation is on-chain,
                  trackable, and clear, with no black boxes.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#FEC601] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEC601]/10 text-[#FEC601] mr-3">
                    4
                  </span>
                  Dignity First
                </h3>
                <p className="text-gray-700 ml-11">
                  We center people, not problems. Everyone deserves to ask for
                  help without shame and receive it without judgment.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#FF3A20] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF3A20]/10 text-[#FF3A20] mr-3">
                    5
                  </span>
                  Tech for Good
                </h3>
                <p className="text-gray-700 ml-11">
                  We use crypto not because it's trendy, but because it's fast,
                  borderless, and fair. Technology should serve people, not the
                  other way around.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#D72483] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D72483]/10 text-[#D72483] mr-3">
                    6
                  </span>
                  Community over Charity
                </h3>
                <p className="text-gray-700 ml-11">
                  We're not here to "save" anyone. We're here to build a system
                  where we show up for each other directly and with heart.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-[#29339B]">
              How We're Different
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-[#FF3A20]">
                  Instant Transfers
                </h3>
                <p className="text-gray-700">
                  Contributions go directly to the recipient's wallet with no
                  waiting period or withdrawal delays.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-[#D72483]">
                  Minimal Fees
                </h3>
                <p className="text-gray-700">
                  We charge only a small platform fee to maintain our services,
                  ensuring more of your contribution reaches those in need.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-[#FEC601]">
                  Simple Process
                </h3>
                <p className="text-gray-700">
                  Create a fundraiser in under 2 minutes and start receiving
                  contributions immediately.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-[#29339B]">Our Team</h2>
            <p className="text-lg text-gray-700 mb-6">
              EmergFund was founded by a team of blockchain enthusiasts and
              social impact professionals who saw the potential for
              cryptocurrency to revolutionize emergency fundraising.
            </p>
            <p className="text-lg text-gray-700">
              Our diverse team brings together expertise in blockchain
              technology, user experience design, and community building to
              create a platform that is both technically robust and easy to use.
            </p>
          </section>

          <section className="text-center p-8 rounded-xl bg-gradient-to-r from-[#29339B]/5 to-[#FF3A20]/5 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-[#29339B]">
              Ready to Make a Difference?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/fundraiser/create">
                <Button className="w-full sm:w-auto bg-[#FF3A20] hover:bg-[#e02e17] text-white text-lg py-6 px-8 rounded-xl group transition-all duration-300">
                  Start Fundraiser
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button className="w-full sm:w-auto bg-[#29339B] hover:bg-[#1e2575] text-white text-lg py-6 px-8 rounded-xl group transition-all duration-300">
                  Explore Fundraisers
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
