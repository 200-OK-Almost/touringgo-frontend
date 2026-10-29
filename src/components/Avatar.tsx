import { useState } from "react";
import "./Avatar.css";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const showImage = Boolean(src) && !hasError;

  return (
    <div className={`avatar avatar--${size} ${className}`} aria-label={alt}>
      {showImage ? (
        <img
          src={src!}
          alt={alt}
          className="avatar-image"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="avatar-fallback" title={name ?? alt}>
          <svg
            className="avatar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}

