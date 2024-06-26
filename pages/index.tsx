import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/pages/__root";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Component,
});

function Component() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="my-24 mx-8 flex flex-col gap-5 items-center">
        <h1 className="text-[min(4rem,13vw)] font-bold">classified.ink</h1>
        <p className="text-[min(1.5rem,5vw)]">
          Truly secure and private note-taking for everyone.
        </p>
      </div>
    </div>
  );
}
