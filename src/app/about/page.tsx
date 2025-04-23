import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
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

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-[#29339B]">
              How We're Different
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-[#FF3A20]">
                  Instant Transfers
                </h3>
                <p className="text-gray-700">
                  Contributions go directly to the recipient's wallet with no
                  waiting period or withdrawal delays.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-[#D72483]">
                  Minimal Fees
                </h3>
                <p className="text-gray-700">
                  We charge only a small platform fee to maintain our services,
                  ensuring more of your contribution reaches those in need.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
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

          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#29339B]">
              Ready to Make a Difference?
            </h2>
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
          </section>
        </div>
      </div>
    </div>
  );
}
