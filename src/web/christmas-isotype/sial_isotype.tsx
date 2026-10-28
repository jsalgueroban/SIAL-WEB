import { useId } from "react";
import type { SVGProps } from "react";
import { ChristmasHatBack, ChristmasHatDefinitions, ChristmasHatFront } from "./sial_christmas_hat";
import { NewYearHatBack, NewYearHatDefinitions, NewYearHatFront } from "./sial_new_year_hat";
import "./sial_isotype.css";

export type SialIsotypeProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  variant?: "default" | "christmas" | "new-year";
  motion?: "none" | "welcome" | "festive";
  size?: number | string;
  title?: string;
};

export function SialIsotype({
  size = 24,
  variant = "default",
  motion = "none",
  title,
  className,
  ...svgProps
}: SialIsotypeProps): React.ReactNode {
  const isChristmas = variant === "christmas";
  const isNewYear = variant === "new-year";
  const isFestive = isChristmas || isNewYear;
  const id = useId().replace(/:/g, "");
  const titleId = `${id}-sial-title`;
  const gradientId = `${id}-sial-blue`;
  const clipId = `${id}-sial-clip`;
  const isDecorative = !title && !svgProps["aria-label"] && !svgProps["aria-labelledby"];

  return (
    <svg
      {...svgProps}
      className={className}
      viewBox="120 120 800 800"
      data-sial-variant={variant}
      data-sial-motion={motion}
      width={size}
      height={size}
      role={title ? "img" : svgProps.role}
      aria-hidden={isDecorative ? true : svgProps["aria-hidden"]}
      aria-labelledby={title ? titleId : svgProps["aria-labelledby"]}
    >
      {title && <title id={titleId}>{title}</title>}
      <defs>
        <linearGradient id={gradientId} x1="138" x2="820" y1="138" y2="820" gradientUnits="userSpaceOnUse">
          <stop stopColor="#005CA8" />
          <stop offset="1" stopColor="#004B91" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d="M162 884V524c0-205 166-371 371-371h318c10 0 18 8 18 18v318c0 205-166 371-371 371H186c-13 0-24 11-24 24z" />
        </clipPath>
      </defs>
      {isFestive && <defs><clipPath id={`${id}-head-clip`}><path d="M0 240 L300 240 C390 280 456 304 541 290 C680 280 772 226 890 216 L1200 216 L1200 1200 H0Z" /></clipPath></defs>}
      {isChristmas && <ChristmasHatDefinitions id={id} />}
      {isNewYear && <NewYearHatDefinitions id={id} />}
      {isChristmas && <ChristmasHatBack id={id} />}
      {isNewYear && <NewYearHatBack id={id} />}
      <g clipPath={isFestive ? `url(#${id}-head-clip)` : undefined}>
      <g transform="matrix(1.0047868,0,0,1.0054432,-4.5532335,-4.6105913)" clipPath={`url(#${clipId})`}>
        <path fill={`url(#${gradientId})`} d="M162 884V524c0-205 166-371 371-371h318c10 0 18 8 18 18v318c0 205-166.00526 369.53091-371 371l-300.16867 2.15115C184.83166 862.24431 162 871 162 884Z" />
        <path fill="#FECC00" d="M486 866c20-76 58-127 118-160 52-28 100-21 144-66 45-46 78-102 112-130l9 359z" />
        <path fill="none" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" d="M486 866c20-76 58-127 118-160 52-28 100-21 144-66 38.3738-39.22655 86.82535-101.21056 121.34584-135.9772 5.96083-6.00334 14.19522-26.2532 19.20169-30.37617" />
        <path fill="none" stroke="#FFFFFF" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" d="M236.2147 874.49295c-1.7872-198.09923 41.98343-409.2361 108.57033-469.76284 58.03464-52.75283 173.38951-69.80776 251.74794-98.7305" />
        <path fill="none" stroke="#FFFFFF" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" d="M353.55754 851.73274c-7.59431-99.70678-17.56539-303.09726 70.23418-326.48582 6.92159-1.84381 72.42887 4.19778 56.53364-54.68669-7.42581-27.50917 21.26119-69.30566 93.28945-25.1792" />
        <path fill="none" stroke="#FFFFFF" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" d="M393.02302 854.95947C347.8748 626.09941 407.06401 683.2609 540.63964 590.43593M202.25116 858.80959C225.13026 633.62681 246.66352 476.54342 351.09623 398.0727" />
        <circle cx="653.09302" cy="294.87479" r="62" fill="#FFFFFF" />
        <circle cx="651.57184" cy="294.87479" r="30" fill="#005CA8" />
        <circle cx="606.69666" cy="459.33185" r="57" fill="#FFFFFF" />
        <circle cx="605.51227" cy="460.69028" r="27" fill="#005CA8" />
        <circle cx="566.45343" cy="587.20923" r="57" fill="#FFFFFF" />
        <circle cx="568.60461" cy="588.28479" r="27" fill="#005CA8" />
      </g>
      </g>
      {isChristmas && <ChristmasHatFront id={id} />}
      {isNewYear && <NewYearHatFront id={id} />}
    </svg>
  );
}
