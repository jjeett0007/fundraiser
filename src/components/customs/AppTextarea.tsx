"use client";

import React, { useEffect, useState } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  error?: string | boolean;
  disabled?: boolean;
}

const AppTextarea = ({
  placeholder,
  error,
  disabled,
  ...props
}: TextareaProps) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timeout = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="flex flex-col w-full  items-start gap-1">
      <div
        className={`flex gap-2 items-center rounded-lg bg-[#0a1a2f]/50 border-[#f2bd74]/30  w-full border p-3 md:p-4 ${
          error
            ? `border-red-500 ${shake ? "animate-shake" : ""}`
            : "border-[#BCBCBC] dark:border-[#888]"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <textarea
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          {...props}
          className={`flex-1 text-white border-0 bg-transparent outline-none text-[16px] resize-none appearance-none ${
            disabled ? "cursor-not-allowed text-[#999] dark:text-[#666]" : ""
          }`}
        />
      </div>
      {error && (
        <div className="text-[#f74831f1] w-full text-xs font-rajdhani bg-[#533a3a4e] p-1 px-2 rounded-md flex items-center gap-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AppTextarea;
