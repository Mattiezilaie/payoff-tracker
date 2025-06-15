// src/components/ui/select.js
import React from "react";

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
