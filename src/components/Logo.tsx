import logoColor from "../assets/logo/logo-touringgo.png";
import logoWhite from "../assets/logo/logo-touringgo-white.png";

interface LogoProps {
  variant?: "color" | "white";
  height?: number;
  className?: string;
}

export default function Logo({ variant = "color", height, className }: LogoProps) {
  const src = variant === "white" ? logoWhite : logoColor;
  const classes = ["logo", className].filter(Boolean).join(" ");

  return (
    <img
      src={src}
      alt="TouringGO"
      className={classes}
      style={height ? { height } : undefined}
    />
  );
}
