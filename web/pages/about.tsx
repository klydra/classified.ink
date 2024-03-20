import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: Component });

function Component() {
  return <div></div>;
}
