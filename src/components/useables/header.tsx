"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface PathValidator {
  (path: string): boolean;
}
function HeaderComp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isLinkActive: PathValidator = (path: string): boolean => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-14 py-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              className="md:hidden text-gray-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary">EmergFund</h1>
            </Link>
          </div>

          <nav
            className={`flex flex-col md:flex-row gap-6 items-start md:items-center absolute md:static top-16 md:top-0 left-0 md:left-auto bg-white md:bg-transparent w-full md:w-auto p-4 md:p-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? "block" : "hidden md:flex"}`}
          >
            <Link
              href="/"
              className={`${isLinkActive("/") ? "text-primary font-semibold" : "text-gray-700"} w-full md:w-fit  font-medium`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`${isLinkActive("/explore") ? "text-primary font-semibold" : "text-gray-700"} w-full md:w-fit  font-medium`}
            >
              Explore
            </Link>
            <Link
              href="/about"
              className={`${isLinkActive("/about") ? "text-primary font-semibold" : "text-gray-700"} w-full md:w-fit  font-medium`}
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className={`${isLinkActive("/dashboard") ? "text-primary font-semibold" : "text-gray-700"} w-full md:w-fit  font-medium`}
            >
              My Dashboard
            </Link>
          </nav>

          <WalletMultiButton />
        </div>
      </header>
    </>
  );
}

export default HeaderComp;
