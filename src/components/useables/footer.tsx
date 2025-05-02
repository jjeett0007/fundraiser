import Link from "next/link";

function FooterComp() {
  return (
    <>
      <footer className="bg-gray-100 py-12 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#29339B] via-[#D72483] to-[#FF3A20] opacity-30"></div>

        <div className="container mx-auto px-4 md:px-10 lg:px-14">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#29339B] mb-4">
                EmergFund
              </h3>
              <p className="text-gray-600 mb-4">
                Fast emergency fundraising on Solana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#29339B]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="text-gray-600 hover:text-[#29339B]"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-[#29339B]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 hover:text-[#29339B]"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-[#29339B]"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-[#29339B]"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#29339B]">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#29339B]">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#29339B]">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} EmergFund. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterComp;
