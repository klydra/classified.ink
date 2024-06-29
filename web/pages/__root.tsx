import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import Icon from "@/components/icon.tsx";
import React, { Suspense } from "react";
import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/toaster.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({ component: Component });

function Component() {
  return (
    <TooltipProvider>
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
        <div className="p-4 flex flex-col gap-1 justify-center items-center h-36 bg-accent">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} classified.ink
          </p>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm font-bold opacity-30">
                {import.meta.env.VITE_COMMIT_HASH}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-sm">
                Built at {import.meta.env.VITE_BUILD_TIME}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </footer>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <Toaster />
    </TooltipProvider>
  );
}
