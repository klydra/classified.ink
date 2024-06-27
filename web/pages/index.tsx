import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/pages/__root";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/app/utils.ts";
import { toast } from "@/components/ui/use-toast.ts";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Component,
});

function Component() {
  const [users, setUsers] = useState<number | undefined>();

  useEffect(() => {
    api.users.index.get().then(({ data, error }) => {
      if (error)
        toast({
          title: "Could not retrieve user count",
          description: error.value,
        });
      else setUsers(data);
    });
  }, []);

  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="my-24 mx-8 flex flex-col gap-5 items-center">
        <h1 className="text-[min(4rem,13vw)] font-bold">classified.ink</h1>
        <p className="text-[min(1.5rem,5vw)]">
          Truly secure and private note-taking for everyone.
        </p>
        <Suspense>
          <p className="text-muted">{users} users and counting...</p>
        </Suspense>
      </div>
    </div>
  );
}
