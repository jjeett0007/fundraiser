import Link from "next/link";
import { Button } from "@/components/ui/button";

function HeaderComp() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#29339B]">EmergFund</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#29339B] font-medium"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-gray-700 hover:text-[#29339B] font-medium"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#29339B] font-medium"
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-[#29339B] font-medium"
            >
              My Fundraisers
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Link href="/fundraiser/create">
              <Button className="bg-[#29339B] hover:bg-[#1e2575] text-white">
                Start Fundraiser
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderComp;
