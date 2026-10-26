import { useState } from "react";
import "./SmartImage.css";

interface SmartImageProps {
  src: string | null | undefined;
  alt: string;
}

function PhotoIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.5-3.5L6 23" />
    </svg>
  );
}

export default function SmartImage({ src, alt }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="smart-image smart-image--placeholder" role="img" aria-label={alt}>
        <PhotoIcon />
      </div>
    );
  }

  return (
    <img
      className="smart-image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
