import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import Icon from "@/components/icon.tsx";
import React from "react";
import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { twMerge } from "tailwind-merge";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="sticky">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 p-4">
            <Link to="/">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 select-none cursor-pointer"
                >
                  <Icon className="w-6" />
                  <div
                    className={twMerge(
                      "xl:block hidden",
                      isActive ? "font-bold" : null,
                    )}
                  >
                    classified.ink
                  </div>
                </Button>
              )}
            </Link>
            <Separator orientation="vertical" className="w-0.5 rounded-full" />
            <Link to="/about">
              {({ isActive }) => (
                <Button variant="ghost" className={isActive ? "font-bold" : ""}>
                  About
                </Button>
              )}
            </Link>
            <Link to="/faq">
              {({ isActive }) => (
                <Button variant="ghost" className={isActive ? "font-bold" : ""}>
                  FAQ
                </Button>
              )}
            </Link>
          </div>
          <div className="flex justify-end items-center gap-6 p-4">
            <Link to="/auth" className="[&.active]:font-bold">
              <Button className="bg-secondary flex items-center gap-2.5">
                Sign in
                <CircleUser />
              </Button>
            </Link>
          </div>
        </div>
        <Separator />
      </header>
      <main className="flex flex-col flex-grow w-full p-2">
        <Outlet />
      </main>
      <footer>
        <div className="p-4 flex justify-center h-36 bg-accent"></div>
      </footer>
    </>
  ),
});
