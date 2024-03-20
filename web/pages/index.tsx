import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/pages/__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
