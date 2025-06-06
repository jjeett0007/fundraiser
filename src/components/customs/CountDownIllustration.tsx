import React from "react";

const CountDownIllustration = ({ countdown }: { countdown: number }) => {
  return (
    <div className="bg-gradient-to-br from-[#0a1a2f] to-[#0c2240] p-8 rounded-xl border border-[#f2bd74]/20 text-center">
      <div className="relative mb-6">
        {/* Animated crypto coins */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f2bd74]/20 to-[#bd0e2b]/20 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#f2bd74] to-[#bd0e2b] flex items-center justify-center">
            <div className="text-white font-bold text-2xl">$</div>
          </div>
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#f2bd74] rounded-full animate-bounce opacity-70"></div>
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#bd0e2b] rounded-full animate-bounce opacity-70"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 -left-4 w-3 h-3 bg-[#f2bd74] rounded-full animate-bounce opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Blockchain network visualization */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="w-3 h-3 bg-[#f2bd74] rounded-full animate-pulse"></div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-[#f2bd74] to-[#bd0e2b] animate-pulse"></div>
          <div
            className="w-4 h-4 bg-[#bd0e2b] rounded-full animate-pulse"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="w-8 h-0.5 bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] animate-pulse"
            style={{ animationDelay: "0.6s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#f2bd74] rounded-full animate-pulse"
            style={{ animationDelay: "0.9s" }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#f2bd74] mb-2">
        Transaction Confirmed!
      </h3>
      <p className="text-white/80 mb-4">
        Your USDC payment is processing on the blockchain
      </p>

      {/* Countdown circle */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#f2bd74"
            strokeWidth="4"
            fill="none"
            strokeOpacity="0.2"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#f2bd74"
            strokeWidth="4"
            fill="none"
            strokeDasharray="226.19"
            strokeDashoffset={226.19 - (226.19 * (15 - countdown)) / 15}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#f2bd74]">{countdown}</span>
        </div>
      </div>

      <p className="text-sm text-white/60">
        Finalizing your contribution in {countdown} seconds...
      </p>

      {/* Loading dots */}
      <div className="flex justify-center space-x-1 mt-4">
        <div className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default CountDownIllustration;
