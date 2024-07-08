import SecretKey from "encryption/models/secret-key";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type Note from "encryption/models/note";

type UserStore = {
  username: string | undefined;
  pk: string | undefined;

  authenticate: (username: string, nc: string) => void;
};

type SessionStore = {
  secretKey: SecretKey | undefined;
  notes: Note[];

  initialize: (secretKey: string) => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      username: undefined,
      pk: undefined,

      authenticate: (username: string, pk: string) => set({ username, pk }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useSessionStore = create<SessionStore>((set) => ({
  secretKey: undefined,
  notes: [],

  initialize: (secretKey: string) =>
    set({ secretKey: SecretKey.fromString(secretKey) }),
}));

// 6#AjzB$c