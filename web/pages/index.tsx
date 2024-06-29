import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/pages/__root";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/app/utils.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { useTranslation } from "react-i18next";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Component,
});

function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="my-24 mx-8 flex flex-col gap-5 items-center">
        <h1 className="text-[min(4rem,13vw)] font-bold">{t("index.title")}</h1>
        <p className="text-[min(1.5rem,5vw)]">{t("index.description")}</p>
        <Suspense fallback={<></>}>
          <UserCount />
        </Suspense>
      </div>
    </div>
  );
}

function UserCount() {
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

  if (users === undefined) return undefined;

  return <p className="text-muted">{users} users and counting...</p>;
}
