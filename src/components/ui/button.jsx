import * as React from "react";
import { cn } from "../../utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition",
        className
      )}
      {...props}
    />
  );
}
