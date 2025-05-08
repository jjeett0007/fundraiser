import { Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import google_logo from "@/assets/google_icon.svg";
import React from "react";

const Redirect = () => {
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
