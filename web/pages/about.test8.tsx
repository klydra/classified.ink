import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/test8")({ component: Component });

function Component() {
  return (
    <div className="p-2">
      <h3>Welcome to About!</h3>
    </div>
  );
}
