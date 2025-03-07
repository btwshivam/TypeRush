import React, { useState, useEffect } from "react";

const TypingHeading = () => {
  const text = "Solo Typing Test";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text[index]);
          setIndex(index + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (index > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        } else {
          setDeleting(false);
        }
      }
    }, deleting ? 100 : 150); // Typing speed & deleting speed

    return () => clearTimeout(timeout);
  }, [index, deleting, text]);

  return (
    <h2 className="text-4xl font-bold text-center mb-6 text-black font-mono">
      {displayedText}
      <span className="animate-blink">|</span>
    </h2>
  );
};

export default TypingHeading;
