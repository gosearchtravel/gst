import React from "react";

export default function PlaneLineIcon({ className = "w-32 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="150" height="8" rx="4" fill="#bcc2cb" />
      <g>
        <path d="M170 10 l20 6 -20 6 5-6z" fill="#8c8897" />
        <rect x="170" y="10" width="20" height="12" fill="none" />
      </g>
      <g>
        <path d="M180 8 l8 8 -8 8 2-8z" fill="#8c8897" />
      </g>
      <g>
        <path d="M185 16 l10 0" stroke="#8c8897" strokeWidth="2" />
      </g>
    </svg>
  );
}
