import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Link,
  Wallet,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="container bg-white sticky top-0 z-[20] px-4 md:px-10 lg:px-14 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* logo */}
          <span className="text-primary font-bold text-xl">EmergeFunds</span>
        </div>
        <Button>Join Waitlist</Button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden ">
          <div className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(10)].map((_, i) => (
                <div key={`h-${i}`} className="w-full h-px bg-primary"></div>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-row justify-between">
              {[...Array(10)].map((_, i) => (
                <div key={`v-${i}`} className="h-full w-px bg-primary"></div>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-purple-100 border border-purple-200">
              <span className="text-primary text-sm">Powered by Solana</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              Help,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                without the wait.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Emergencies don't give warnings. EmergeFunds makes it possible to
              receive or send urgent financial support in minutes, not days.
            </p>

            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur-xl opacity-20"></div>
              <div className="relative bg-white border border-purple-100 p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-800 font-medium mb-4">
                  Join the Waitlist
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Be the first to access instant fundraising when it matters
                  most.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
                  />
                  <Button className="whitespace-nowrap">
                    Join Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-16">
              Raise. Share. Receive.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Fast.
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-purple-100 p-6 rounded-xl relative group hover:shadow-md transition-all">
                <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">
                  Create a simple fundraiser
                </h3>
                <p className="text-gray-600">
                  No long forms or paperwork. Just the basics, with full
                  transparency.
                </p>
              </div>

              <div className="bg-white border border-purple-100 p-6 rounded-xl relative group hover:shadow-md transition-all">
                <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">
                  Share your link
                </h3>
                <p className="text-gray-600">
                  With friends, family, communities, and anyone who wants to
                  help.
                </p>
              </div>

              <div className="bg-white border border-purple-100 p-6 rounded-xl relative group hover:shadow-md transition-all">
                <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">
                  Receive support instantly
                </h3>
                <p className="text-gray-600">
                  Funds arrive in minutes, directly to your wallet. No waiting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Real Emergencies */}
        <section className="container overflow-hidden mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Sharp geometric patterns */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-4 border-l-4 border-primary opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-4 border-r-4 border-primary opacity-30"></div>
            <div className="absolute top-1/4 -right-5 w-10 h-10 border-r-4 border-t-4 border-primary opacity-30 rotate-45"></div>
            <div className="absolute bottom-1/4 -left-5 w-10 h-10 border-l-4 border-b-4 border-primary opacity-30 rotate-45"></div>

            {/* Diagonal lines */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -left-10 w-20 h-20">
                <div className="w-full h-0.5 bg-primary opacity-20 rotate-45 origin-bottom-left transform translate-y-10"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20">
                <div className="w-full h-0.5 bg-primary opacity-20 rotate-45 origin-top-right transform -translate-y-10"></div>
              </div>
            </div>

            {/* Zigzag pattern */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 h-40 w-2 flex flex-col justify-between">
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
            </div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 h-40 w-2 flex flex-col justify-between">
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
              <div className="w-2 h-2 bg-primary opacity-40"></div>
            </div>

            <div className="relative z-10 bg-white border border-purple-100 p-10 rounded-xl shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Designed for life's urgent moments.
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Whether it's medical bills, food insecurity, or disaster relief,
                EmergeFunds ensures help arrives when it's needed most.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                    <CheckCircle className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Small donations, big impact
                  </h3>
                </div>

                <div className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                    <CheckCircle className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Secure, transparent, and fast
                  </h3>
                </div>

                <div className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                    <CheckCircle className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Open to anyone, anywhere
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-16">
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                EmergeFunds
              </span>
              ?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-purple-100 p-8 rounded-xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Zap className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-xl font-semibold mb-2">
                    Instant payouts
                  </h3>
                  <p className="text-gray-600">No bank delays</p>
                </div>
              </div>

              <div className="bg-white border border-purple-100 p-8 rounded-xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Wallet className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-xl font-semibold mb-2">
                    Low Fees
                  </h3>
                  <p className="text-gray-600">
                    A good chunk of donations go where they're needed
                  </p>
                </div>
              </div>

              <div className="bg-white border border-purple-100 p-8 rounded-xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Link className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-xl font-semibold mb-2">
                    Accessible
                  </h3>
                  <p className="text-gray-600">
                    Lightweight, mobile-first, easy to use
                  </p>
                </div>
              </div>

              <div className="bg-white border border-purple-100 p-8 rounded-xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Clock className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-xl font-semibold mb-2">
                    Built on Solana
                  </h3>
                  <p className="text-gray-600">
                    For speed, transparency, and low cost
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Testimonials
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Coming soon: Stories from early users who received help in hours,
              not days.
            </p>

            <div className="bg-white border border-purple-100 p-8 rounded-xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  width={80}
                  height={80}
                  alt=""
                  className="rounded-full"
                />
              </div>
              <p className="text-gray-600 italic mb-4">
                "Stories from early users who received help in hours, not days
                will appear here."
              </p>
              <p className="text-gray-800 font-medium">Future User</p>
              <p className="text-gray-500 text-sm">Early Adopter</p>
            </div>
          </div>
        </section> */}

        {/* Sticky Waitlist Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-10 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=600&width=1200')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                Join the waitlist
              </h2>
              <p className="text-xl text-gray-600 text-center mb-8">
                Get early access to a better way to give and get help.
              </p>

              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
                  />
                  <Button className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap">
                    Join Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-500 text-sm mt-3 text-center">
                  We'll never spam you. Just an invite when we're ready.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 md:px-10 lg:px-14 py-4 border-t border-purple-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center justify-center md:justify-normal gap-2 mb-4">
                {/* logo */}
                <span className="text-primary font-bold">EmergeFunds</span>
              </div>
              <p className="text-gray-500 text-sm">
                Built with care. Powered by Solana.
              </p>
            </div>

            <div className="flex gap-6">
              <a
                href="https://x.com/EmergeFunds_"
                className="text-gray-600 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <s>Twitter</s> X
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Superteam
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
