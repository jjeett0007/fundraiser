"use client";

import { Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import google_logo from "@/assets/google_icon.svg";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "@/store/slice/userTokenSlice";
import apiRequest from "@/utils/apiRequest";
import { setData } from "@/store/slice/userDataSlice";

const Redirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const type = searchParams.get("type");
        const token = searchParams.get("token");
        const expiresIn = searchParams.get("expiresIn")?.replace("$", "");
        const email = searchParams.get("email");
        const id = searchParams.get("id");

        if (!token || !expiresIn || !email || !id) {
          throw new Error("Missing required parameters");
        }

        if (type === "login" || type === "signup") {
          document.cookie = `Access=${token}; path=/; secure; max-age=${
            2 * 24 * 60 * 60
          }; samesite=strict`;

          if (type === "login") {
            try {
              const response = await apiRequest("GET", "/user");
              if (response.status === 200) {
                dispatch(
                  setData({
                    ...response.data,
                    email: email,
                    id: id,
                  })
                );

                dispatch(
                  setToken({
                    token: token,
                    expiresIn: expiresIn,
                    isAuthenticated: true,
                  })
                );

                document.cookie = `Access=${token}; path=/; secure; max-age=${
                  2 * 24 * 60 * 60
                }; samesite=strict`;

                const expirationInSeconds =
                  Math.floor(Date.now() / 1000) + parseInt(expiresIn);
                document.cookie = `expiresIn=${expirationInSeconds}; path=/; secure; max-age=${expiresIn}; samesite=strict`;

                toast({
                  title: "Success",
                  description: `Logging in as ${email}!`,
                });

                router.push("/");
              } else {
                toast({
                  title: "Error",
                  description: response.message,
                  variant: "destructive",
                });
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to fetch user data. Please try again.",
                variant: "destructive",
              });
            }
          } else if (type === "signup") {
            router.push("/signup");
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        router.push("/login");
      }
    };
    handleRedirect();
  }, [searchParams, dispatch, router, toast]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-200 to-indigo-200">
      <div className="flex relative items-center justify-center mb-4">
        <div className="border-[#000] border rounded-full">
          <Image
            src={google_logo}
            height={1000}
            width={1000}
            className="w-[3rem] p-2 object-cover"
            alt={"google_logo"}
            priority
          />
        </div>
        <div className="h-6 absolute w-6 flex items-center justify-center rounded-full bg-black text-white">
          <PlusIcon size={13} />
        </div>
        <div className="border-[#000] border rounded-full">
          <Image
            src={google_logo}
            height={1000}
            width={1000}
            className="w-[3rem] p-2 object-cover"
            alt={"company_logo"}
            priority
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />{" "}
        <p className="text-lg text-[#333]">Redirecting...</p>
      </div>
    </div>
  );
};

export default Redirect;
