"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default function AnimatedWord({
  words = ["medical", "business", "family", "school", "hospital", "community" ],
  interval = 1000,
  className = "",
}: AnimatedWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);

      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return () => clearTimeout(transitionTimer);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval, currentIndex]);

  const getMaxWidth = () => {
    if (typeof window !== "undefined") {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.fontSize = "inherit";
      tempSpan.style.fontWeight = "inherit";

      let maxWidth = 0;
      words.forEach((word) => {
        tempSpan.innerText = word;
        document.body.appendChild(tempSpan);
        const width = tempSpan.getBoundingClientRect().width;
        if (width > maxWidth) maxWidth = width;
        document.body.removeChild(tempSpan);
      });

      return maxWidth > 0 ? `${maxWidth + 10}px` : "auto"; // Add a small buffer
    }
    return "auto";
  };

  return (
    <span
      className={`inline-block relative ${className}`}
      style={{
        minWidth: getMaxWidth(),
        display: "inline-block",
      }}
    >
      {/* Current word */}
      <motion.span
        key={`current-${currentIndex}`}
        initial={{
          opacity: 0,
          scale: 0.7,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="inline-block"
      >
        {words[currentIndex]}
      </motion.span>

      {/* Previous word that's exiting */}
      {isTransitioning && (
        <motion.span
          key={`prev-${prevIndex}`}
          initial={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          animate={{
            opacity: 0,
            scale: 1.2,
            y: -10,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.3,
          }}
          className="absolute top-0 left-0 inline-block"
        >
          {words[prevIndex]}
        </motion.span>
      )}
    </span>
  );
}
