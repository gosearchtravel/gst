import React from "react";

export default function PlaneIcon({ className = "w-4 h-4 inline-block mx-1 text-gray-400" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.94 2.94a1 1 0 011.32-.08l12.5 8.5a1 1 0 01-.08 1.68l-4.5 2.5a1 1 0 01-1.08 0l-3.5-2-2.5 1.5a1 1 0 01-1.5-.87V4a1 1 0 01.34-.74zM4 5.12v7.76l1.5-.9a1 1 0 011.08 0l3.5 2 3.9-2.17L4 5.12z" />
    </svg>
  );
}
