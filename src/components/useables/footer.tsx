import Link from "next/link";

function FooterComp() {
  return (
    <>
      <footer className=" py-12 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primaryGold via-[#D72483] to-[#FF3A20] opacity-30"></div>

        <div className="container font-rajdhani mx-auto px-4 md:px-10 lg:px-14">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primaryGold mb-4">
                EmergFunds
              </h3>
              <p className="text-[#ede4d3] mb-4">
                Fast emergency fundraising on Solana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-[#ede4d3] hover:text-primaryGold"
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
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[#ede4d3] hover:text-primaryGold"
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
                  <Link
                    href="https://x.com/EmergFunds_"
                    className="text-[#ede4d3] hover:text-primaryGold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s>Twitter</s> X
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#ede4d3] hover:text-primaryGold"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#ede4d383] mt-8 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} EmergFunds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterComp;
