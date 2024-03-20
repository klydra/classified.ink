import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Branding from "@/components/branding.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex items-center gap-6 p-4">
        <Branding />
        <div className="h-6 w-0.5 bg-white rounded-full"></div>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
