import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/app/zustand.ts";

export const Route = createFileRoute("/hello")({
  component: () => {
    const userStore = useUserStore();

    return (
      <div className="flex-grow w-full flex flex-col justify-center items-center">
        <p className="px-4 py-6 text-2xl">
          Welcome aboard, <b>{userStore.username}</b>!
        </p>
        <p className="grid grid-cols-4 px-4 py-6 text-xl">{userStore.pk}</p>
        <p>
          Note this down.
          <br />
          This is your <b>key</b>.
          <br />
          You can <b>not restore it</b>.<br />
          It's also saved in this browser.
          <br />
          But if it's gone, <b>your notes are gone</b>.
        </p>
      </div>
    );
  },
});
