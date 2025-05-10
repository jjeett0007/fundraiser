import React from "react";

const SubHeading = ({ label }: { label: string }) => {
  return (
    <div className="relative items-center justify-start py-5 flex">
      <span className="font-light text-[13px] border absolute bg-white px-2 py-0 rounded-full">
        {label}
      </span>
      <div className="border border-t w-full"></div>
    </div>
  );
};

export default SubHeading;
