"use client";

import { useState, useRef, useEffect } from "react";
import { countries } from "@/utils/list";

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CountrySelector({
  value,
  onChange,
  error,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find((country) => country.value === value);

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          onChange(filteredCountries[highlightedIndex].value);
          setIsOpen(false);
          setSearchTerm("");
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
    setHighlightedIndex(0);
  };

  const handleCountrySelect = (countryValue: string) => {
    onChange(countryValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors ${
          isOpen
            ? "bg-[#0a1a2f] border border-[#f2bd74] text-white"
            : "bg-[#0a1a2f]/50 border border-[#f2bd74]/30 text-white hover:border-[#f2bd74]/60"
        } ${error ? "border-[#bd0e2b]" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedCountry ? "text-white" : "text-gray-400"}>
          {selectedCountry ? selectedCountry.label : "Select a country"}
        </span>
        <svg
          className={`h-5 w-5 text-[#f2bd74] transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-[#bd0e2b]">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-[#0a1a2f] border border-[#f2bd74]/30 rounded-lg shadow-lg overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-[#f2bd74]/20">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder="Search country..."
              className="w-full px-3 py-2 bg-[#0a1a2f]/70 border border-[#f2bd74]/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#f2bd74]"
            />
          </div>

          {/* Country List */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No country found
              </div>
            ) : (
              <ul role="listbox">
                {filteredCountries.map((country, index) => (
                  <li
                    key={country.value}
                    role="option"
                    aria-selected={value === country.value}
                    onClick={() => handleCountrySelect(country.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
                      highlightedIndex === index
                        ? "bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 text-white"
                        : "text-gray-200 hover:bg-[#f2bd74]/10"
                    } ${value === country.value ? "bg-[#f2bd74]/10" : ""}`}
                  >
                    <span className="w-5 mr-2 inline-flex justify-center">
                      {value === country.value && (
                        <svg
                          className="h-4 w-4 text-[#f2bd74]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {country.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a1a2f;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(242, 189, 116, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(242, 189, 116, 0.5);
        }
      `}</style>
    </div>
  );
}
