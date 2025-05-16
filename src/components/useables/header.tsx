"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LogOutIcon } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { clearData } from "@/store/slice/userDataSlice";
import { clearToken } from "@/store/slice/userTokenSlice";
import Cookies from "js-cookie";
import white_wording_logo from "@/assets/white_wording_logo.svg";
import Image from "next/image";

interface PathValidator {
  (path: string): boolean;
}

function HeaderComp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const userToken = useSelector((state: RootState) => state.userToken);
  const isHomePage = pathname === "/";
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenLogoutDialog = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    dispatch(clearData());
    dispatch(clearToken());
    router.push("/login");
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

  const getHeaderStyle = () => {
    if (isHomePage) {
      return scrolled
        ? "bg-[#06101d64] backdrop-blur-md fixed right-0 left-0 top-0"
        : "bg-transparent absolute top-0 right-0 left-0";
    }
    return "bg-[#06101d64] backdrop-blur-md sticky right-0 left-0 top-0";
  };

  const getLinkStyle = (link: string) => {
    const isActive = isLinkActive(link);

    if (isHomePage && !scrolled) {
      return isActive
        ? "text-primaryGold font-semibold"
        : "text-white hover:text-[#ede4d3]";
    }

    return isActive
      ? "text-primaryGold font-semibold"
      : "text-white hover:text-[#ede4d3]";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] h-[30vh] lg:max-w-[30%] md:h-fit">
          <DialogHeader>
            <DialogTitle> Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? This will remove your session and
              redirect you to the login page.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="flex item-center justify-center gap-2">
              <Button
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button onClick={handleLogout} className="w-full">
                Yes, Logout
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <header
        className={`z-[30] transition-colors font-rajdhani duration-300 ${getHeaderStyle()}`}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-14 py-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Button
              className="md:hidden text-[#ede4d3]"
              onClick={toggleMenu}
              variant={"outline"}
              size={"icon"}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </Button>
            <Link href="/">
              <Image
                src={white_wording_logo}
                alt={"white_wording_logo"}
                height={1000}
                width={1000}
                className="md:w-[6rem] w-[5rem] lg:w-[8rem] "
              />
            </Link>
          </div>
          <nav
            className={`flex flex-col md:flex-row gap-6 items-start md:items-center absolute md:static top-16 md:top-0 left-0 md:left-auto bg-primary md:bg-transparent w-full md:w-auto p-4 md:p-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
              isMenuOpen ? "block" : "hidden md:flex"
            }`}
          >
            {navLink.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={toggleMenu}
                className={`${getLinkStyle(item.link)} w-full md:w-fit font-medium`}
              >
                {item.name}
              </Link>
            ))}
            {userToken.isAuthenticated === false && (
              <div className="flex md:hidden gap-2 items-center">
                <Button variant={"outline"}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button>
                  <Link href="/signup">SignUp</Link>
                </Button>
              </div>
            )}
          </nav>
          {userToken.isAuthenticated === true ? (
            <Button
              onClick={handleOpenLogoutDialog}
              variant={"ghost"}
              className="font-rajdhani "
            >
              <LogOutIcon className="mr-1 h-4 w-4" /> Logout
            </Button>
          ) : (
            <>
              <div className="md:flex gap-2 hidden items-center">
                <Button asChild variant={"outline"}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">SignUp</Link>
                </Button>
              </div>

              <div className="md:hidden ">
                <Button asChild variant={"ghost"}>
                  <Link href="/login">Login/SignUp</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default HeaderComp;
