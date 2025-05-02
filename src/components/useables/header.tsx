"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "../ui/button";

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

  const navLink = [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/explore",
      name: "Explore",
    },
    {
      link: "/about",
      name: "About",
    },
    {
      link: "/dashboard",
      name: "My Dashboard",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-[20] bg-white border-b border-gray-200">
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
            {navLink.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`${
                  isLinkActive(item.link)
                    ? "text-primary font-semibold"
                    : "text-gray-700"
                } w-full md:w-fit font-medium`}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex md:hidden gap-2 items-center">
              <Button variant={"outline"}>
                <Link href="/login">Login</Link>
              </Button>
              <Button>
                <Link href="/signup">SignUp</Link>
              </Button>
            </div>
          </nav>

          <div className="md:flex gap-2 hidden items-center">
            <Button variant={"outline"}>
              <Link href="/login">Login</Link>
            </Button>
            <Button>
              <Link href="/signup">SignUp</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderComp;
