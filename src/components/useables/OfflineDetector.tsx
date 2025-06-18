"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { FiAlertOctagon } from "react-icons/fi";

const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => {
        setShowReconnected(false);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center  backdrop-blur-sm justify-center transition-opacity duration-300
        ${isOnline ? "bg-black/20" : "bg-black/80"}`}
    >
      {!isOnline ? (
        <div className="flex flex-col items-center gap-4 max-w-sm mx-4">
          <FiAlertOctagon className="w-12 h-12 bg-primary backdrop-blur-xl rounded-full   p-2 text-red-500" />

          <p className="text-white font-rajdhani w-fit text-center bg-primary rounded-lg p-2">
            You are currently offline. Please check your internet connection.
            <Button onClick={handleRefresh} variant={"link"}>
              Refresh
            </Button>
          </p>
        </div>
      ) : (
        <div className="bg-primary rounded-lg p-3 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <span className="text-[#86e686] font-rajdhani">Great!, Back Online</span>
        </div>
      )}
    </div>
  );
};

export default OfflineDetector;
