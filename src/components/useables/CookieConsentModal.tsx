"use client";

import React, { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "../ui/button";

const CookieConsentModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentGiven = sessionStorage.getItem("cookieConsentShown");
    if (!consentGiven) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    const consentData = {
      necessary: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    sessionStorage.setItem("cookieConsent", JSON.stringify(consentData));
    sessionStorage.setItem("cookieConsentShown", "true");
    setIsVisible(false);

    initializeScripts(consentData);
  };

  const handleReject = () => {
    const consentData = {
      necessary: false,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    sessionStorage.setItem("cookieConsent", JSON.stringify(consentData));
    sessionStorage.setItem("cookieConsentShown", "true");
    setIsVisible(false);
  };

  interface ConsentData {
    necessary: boolean;
    timestamp: string;
    version: string;
  }

  const initializeScripts = (consent: ConsentData): void => {
    if (consent.necessary) {
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[700] flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#0a1a2f] to-[#0c2240] border border-primaryGold/20 rounded-lg shadow-2xl transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primaryGold/20 rounded-full">
              <Cookie className="w-6 h-6 text-primaryGold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-rajdhani">
                Cookie Notice
              </h2>
              <p className="text-sm text-gray-300">
                We use cookies to enhance your experience
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              We use necessary cookies to ensure our website functions properly
              and provides you with the best possible experience. These cookies
              are essential for basic functionality and security.
            </p>
          </div>

          <div className="flex gap-3 items-center justify-center">
            <Button
              onClick={handleReject}
              variant="outline"
              className="px-6 py-2 bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
            >
              Reject
            </Button>

            <Button
              onClick={handleAccept}
              className="px-6 py-2 bg-primaryGold text-black rounded-lg transition-colors "
            >
              Accept
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 bg-white/5 rounded-b-lg border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            By continuing to use our website, you agree to our{" "}
            <a
              href="/privacy-policy"
              className="text-primaryGold hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/cookie-policy"
              className="text-primaryGold hover:underline"
            >
              Cookie Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Hook to check cookie consent status
export const useCookieConsent = () => {
  const [consentData, setConsentData] = useState(null);

  useEffect(() => {
    const consent = sessionStorage.getItem("cookieConsent");
    if (consent) {
      setConsentData(JSON.parse(consent));
    }
  }, []);

  const updateConsent = (newConsent: React.SetStateAction<null>) => {
    sessionStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    sessionStorage.setItem("cookieConsentShown", "true");
    setConsentData(newConsent);
  };

  const clearConsent = () => {
    sessionStorage.removeItem("cookieConsent");
    sessionStorage.removeItem("cookieConsentShown");
    setConsentData(null);
  };

  const resetModal = () => {
    sessionStorage.removeItem("cookieConsentShown");
  };

  return {
    consentData,
    hasConsent: !!consentData,
    updateConsent,
    clearConsent,
    resetModal,
  };
};

export default CookieConsentModal;
