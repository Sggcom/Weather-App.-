import * as React from "react";
import { cn } from "../../utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
}
