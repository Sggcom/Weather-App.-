import * as React from "react";
import { cn } from "../../utils";

export function Card({ className, ...props }) {
  return (
    <div className={cn("bg-white shadow-lg rounded-xl p-6 w-96 mx-auto mt-6", className)} {...props} />
  );
}
