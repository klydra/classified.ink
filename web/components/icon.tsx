import { twMerge } from "tailwind-merge";

export default function Icon({ className }: { className?: string }) {
  return (
    <svg
      className={twMerge(
        "stroke-white w-full h-full object-contain aspect-square",
        className,
      )}
      viewBox="0 -10 48 48"
    >
      <path
        d="M42 2H2"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10L2 10"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18H2"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 26L2 26"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.1013 24.6559L42.5845 15.9225L46.3274 18.2725L40.8442 27.0058L37.1013 24.6559Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.8012 17.1702L38.5368 9.90238L23 9.71448L29.9204 23.6262L37.8846 23.4083L41.8012 17.1702Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 9.71448L32.4645 15.6567"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.6929 18.7952C35.8145 18.5388 36.5159 17.4216 36.2595 16.3C36.0031 15.1783 34.8859 14.4769 33.7643 14.7333C32.6426 14.9898 31.9412 16.1069 32.1976 17.2286C32.4541 18.3502 33.5712 19.0516 34.6929 18.7952Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
