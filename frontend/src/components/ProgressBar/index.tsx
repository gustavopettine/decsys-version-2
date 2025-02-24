"use client";

import { ProgressBarProps } from "@/components/Result";

export function ProgressBar({ percentageValue, probabilityText }: ProgressBarProps) {
  const radius = 45;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentageValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-40 h-20 flex items-center justify-center">
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 50"
          width="100%"
          height="100%"
        >
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#3f3f46"
            strokeWidth={strokeWidth}
          />
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#2563eb"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="text-2xl font-bold mt-8">{percentageValue}%</span>
      </div>

      <div className="flex flex-col items-center text-center w-20">
        <p>{probabilityText}</p>
      </div>
    </div>
  );
}
