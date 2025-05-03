"use client";

import React, { useState, useEffect } from "react";
import { PiEyeSlash, PiEye } from "react-icons/pi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  error?: string | boolean;
}

const AppInput = ({
  type = "text",
  placeholder,
  error,
  disabled,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (error) {
      setShake(true);
      const timeout = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="flex flex-col w-full items-start gap-1">
      <div
        className={`flex gap-2 items-center rounded-lg w-full border ${
          type === "password" ? "" : "p-2 py-[5px]"
        } ${
          error
            ? `border-red-500 ${shake ? "animate-shake" : ""}`
            : "border-[#BCBCBC] dark:border-[#888]"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          className={`flex-1 border-0 bg-transparent outline-none text-[16px] appearance-none ${
            type === "password" ? "pl-2" : ""
          } ${disabled ? "cursor-not-allowed text-[#999]" : ""}`}
        />
        {type === "password" && !disabled && (
          <span
            onClick={togglePasswordVisibility}
            className="cursor-pointer p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#363636ac] rounded-lg"
          >
            {showPassword ? <PiEyeSlash /> : <PiEye />}
          </span>
        )}
      </div>
      {error && (
        <div className="text-[#f35844f1] w-full text-[12px] bg-[#febbbb4e] p-1 px-2 rounded-md flex items-center gap-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AppInput;
