// src/components/NoContent.tsx
"use client";

import React from "react";
import type { NoContentProps } from "../types";

const NoContent = ({
  text = "No data available",
  icon,
}: NoContentProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
    {icon && <div className="mb-4">{icon}</div>}
    <p>{text}</p>
  </div>
);

export default NoContent;