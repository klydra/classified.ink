import React from "react";
import Icon from "@/components/icon.tsx";
import { Link } from "@tanstack/react-router";

export default function Branding() {
  return (
    <Link to="/">
      <div className="flex items-center gap-3 select-none cursor-pointer">
        <Icon className="w-6" />
        <p>classified.ink</p>
      </div>
    </Link>
  );
}
