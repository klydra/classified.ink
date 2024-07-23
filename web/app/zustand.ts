import SecretKey from "encryption/models/secret-key";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type Note from "encryption/models/note";
import SecretLock from "encryption/models/secret-lock";

type UserStore = {
  username: string | undefined;
  pk: string | undefined;

  authenticate: (username: string, pk: string) => void;
};

type SessionStore = {
  secretKey: SecretKey | undefined;
  secretLock: SecretLock | undefined;
  notes: Note[];

  initialize: (secretLock: SecretLock, secretKey: SecretKey) => void;
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
  secretLock: undefined,
  notes: [],

  initialize: (secretLock: SecretLock, secretKey: SecretKey) =>
    set({ secretLock, secretKey }),
}));
