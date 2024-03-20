import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Branding from "@/components/branding.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex items-center gap-6 p-4">
        <Branding />
        <div className="h-6 w-0.5 bg-muted-foreground rounded-full"></div>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </header>
      <div className="h-0.5 bg-muted mx-3.5 rounded-full"></div>
      <main className="p-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
