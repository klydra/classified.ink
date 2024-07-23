import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/app/zustand.ts";
import { hexStringToUint8Array } from "encryption/crypto.ts";
import { bitsToBIP39, uint8ArrayToBits } from "encryption/bip39.ts";

export const Route = createFileRoute("/hello")({
  component: () => {
    const userStore = useUserStore();
    const phrase = userStore.pk
      ? bitsToBIP39(uint8ArrayToBits(hexStringToUint8Array(userStore.pk)))
      : undefined;

    return (
      <div className="flex-grow w-full flex flex-col justify-center items-center">
        <p className="px-4 py-6 text-2xl">
          Welcome aboard, <b>{userStore.username}</b>!
        </p>
        <div className="grid grid-cols-4 gap-x-8 gap-y-4 px-4 py-16 text-2xl text-center font-bold leading-relaxed">
          {phrase?.map((word, index) => {
            return <p key={index}>{word}</p>;
          })}
        </div>
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
