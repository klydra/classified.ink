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
        <p className="text-muted text-sm">
          You can now start creating notes.
          <br />
          You can also view your notes in the dashboard.
        </p>
        <p>
          Among your chosen password, you will also need to have your PK to gain
          access to your notes.
          <br />
          We have already saved it for you in this browser, but you should note
          it down to log in somewhere else or if it's lost here.
        </p>
      </div>
    );
  },
});
