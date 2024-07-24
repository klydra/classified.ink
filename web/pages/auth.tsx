import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle,
  CloudOff,
  Loader2,
  LogIn,
  Plus,
  RectangleEllipsis,
  XCircle,
} from "lucide-react";
import { UserUsername } from "api/drizzle/schema";
import { api, cn } from "@/app/utils";
import { useQuery } from "@tanstack/react-query";
import SecretKey from "encryption/models/secret-key";
import SecretLock from "encryption/models/secret-lock";
import { toast } from "sonner";
import { useSessionStore, useUserStore } from "@/app/zustand.ts";
import { BIP39_RUNE } from "encryption/bip39";

export const Route = createFileRoute("/auth")({ component: Component });

const VerifyUsername = UserUsername;
const VerifyUsernameLength = "^.{3,20}$";
const VerifyUsernameValid = "^[\\w\\.\\-]+$";

const VerifyPassword = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$";
const VerifyPasswordUppercase = "(?=.*[A-Z])";
const VerifyPasswordLowercase = "(?=.*[a-z])";
const VerifyPasswordNumber = "(?=.*\\d)";
const VerifyPasswordLength = "^.{8,}$";

function Component() {
  const userStore = useUserStore();

  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [username, setUsername] = useState(userStore.username ?? "");
  const [password, setPassword] = useState("");
  const [pk, setPK] = useState<string[]>(userStore.pk ? [userStore.pk] : []); // TODO

  const { isLoading: userLoading, data: user } = useQuery({
    queryKey: [username],
    queryFn: username.match(VerifyUsername)
      ? () => api.users.get.post({ username })
      : undefined,
  });

  return (
    <div className="flex-grow w-full flex justify-center items-center">
      <Card className="w-96 mx-6 my-8">
        <CardHeader>
          <CardTitle>Welcome dear note taker!</CardTitle>
          <CardDescription>Enter your username to get started.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col mt-2">
          <div className="flex flex-col">
            <Input
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              type="text"
              placeholder="Username"
            />
            <div
              className={cn(
                "flex flex-col gap-1 transition-all duration-300 ease-in-out pointer-events-none",
                usernameFocus && !username.match(VerifyUsername)
                  ? "pt-3 opacity-100 h-12"
                  : "pt-0 opacity-0 h-0",
              )}
            >
              <Requirement
                regex={VerifyUsernameLength}
                check={username}
                description="Between 3 and 20 characters long"
              />
              <Requirement
                regex={VerifyUsernameValid}
                check={username}
                description="Only valid characters"
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <Input
              disabled={user?.status !== 404 && user?.status !== 200}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              type="password"
              placeholder="Password"
            />
            <div
              className={cn(
                "flex flex-col gap-1 transition-all duration-300 ease-in-out pointer-events-none",
                passwordFocus &&
                  user?.status === 404 &&
                  !password.match(VerifyPassword)
                  ? "pt-3 opacity-100 h-[5.25rem]"
                  : "pt-0 opacity-0 h-0",
              )}
            >
              <Requirement
                regex={VerifyPasswordLength}
                check={password}
                description="At least 8 characters long"
              />
              <Requirement
                regex={VerifyPasswordUppercase}
                check={password}
                description="At least one uppercase letter"
              />
              <Requirement
                regex={VerifyPasswordLowercase}
                check={password}
                description="At least one lowercase letter"
              />
              <Requirement
                regex={VerifyPasswordNumber}
                check={password}
                description="At least one number"
              />
            </div>
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              user?.status === 200 && !userStore.pk
                ? "opacity-100 h-10 mt-4"
                : "opacity-0 h-0 pointer-events-none",
            )}
          >
            <BIP39Input pk={pk} setPK={setPK} />
          </div>
          <div className="flex flex-col mt-4">
            <Action
              userLoading={userLoading}
              status={user?.status}
              username={username}
              password={password}
              pk={pk}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Action({
  userLoading,
  status,
  username,
  password,
  pk,
}: {
  userLoading: boolean;
  status: number | undefined;
  username: string;
  password: string;
  pk: string[];
}) {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const sessionStore = useSessionStore();

  if (!username.match(VerifyUsername))
    return (
      <Button disabled>
        <RectangleEllipsis className="mr-2 h-4 w-4" /> Enter your username
      </Button>
    );

  if (userLoading)
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
      </Button>
    );

  if (status === 404)
    return (
      <Button
        disabled={!password.match(VerifyPassword)}
        onClick={async () => {
          const secretLock = await SecretLock.withPassword(password);
          const secretKey = await SecretKey.withLock(secretLock);
          const user = await api.users.create.post({
            username,
            secretKey: secretKey.toString(),
          });

          if (user.error) {
            toast("Couldn't create account", {
              description: user.error.value,
            });
            return;
          }

          userStore.authenticate(username, secretLock.pk);
          sessionStore.initialize(secretLock, secretKey);

          toast("Account created");
          await navigate({ to: "/hello" });
        }}
      >
        <Plus className="mr-2 h-4 w-4" /> Create account
      </Button>
    );

  if (status === 200)
    return (
      <>
        <Button
          disabled={!password.length || !pk.length}
          onClick={async () => {
            const secretLock = new SecretLock(pk, password);

            const user = await api.users.get.post({ username });
            if (user.error) {
              toast("Couldn't retrieve account", {
                description: user.error.value,
              });
              return;
            }

            const secretKey = SecretKey.fromString(user.data.secretKey);

            if (!(await secretKey.proof(secretLock))) {
              console.log("Proof failed");

              toast("Couldn't verify account", {
                description:
                  "The provided lock (of password and private key) does not match the secret key.",
              });
              return;
            }

            sessionStore.initialize(secretLock, secretKey);

            toast("Logged in", {
              description: "You can now start using the app.",
            });

            await navigate({ to: "/notes" });
          }}
        >
          <LogIn className="mr-2 h-4 w-4" /> Log in
        </Button>
      </>
    );

  return (
    <Button disabled>
      <CloudOff className="mr-2 h-4 w-4" /> Couldn't check status
    </Button>
  );
}

function Requirement({
  regex,
  check,
  description,
}: {
  regex: string;
  check: string;
  description: string;
}) {
  const match = check.match(regex);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs",
        match ? "text-green-500" : "text-red-500",
      )}
    >
      {match ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {description}
    </div>
  );
}

function BIP39Input({
  pk,
  setPK,
}: {
  pk: string[];
  setPK: (value: string[]) => void;
}) {
  const TOTAL_WORDS = 12;

  const [phrase, setPhrase] = useState<string[]>([""]);

  function onChange(value: string) {
    if (!value.match("^([a-z]+ {0,1})+$")) return;

    const words = value.split(" ");
    const trailing = words[words.length - 1];
    const result: string[] = [];

    for (let i = 0; i < words.length - 1; i++) {
      if (BIP39_RUNE.includes(words[i])) {
        result.push(words[i]);
      }
    }

    console.log("phrase: ");
    console.log(phrase);

    console.log("words: ");
    console.log(words);

    console.log(value);

    console.log("trailing: " + trailing);

    if (
      value.length === 0 ||
      value.endsWith(" ") ||
      trailing.length > phrase[phrase.length - 1].length
    ) {
      if (trailing.length > 0 && BIP39_RUNE.includes(trailing)) {
        result.push(trailing);
        result.push("");
      } else {
        const matches = BIP39_RUNE.filter((item) => item.startsWith(trailing));
        console.log(matches);

        if (
          matches.length === 1 &&
          trailing.length > phrase[phrase.length - 1].length
        ) {
          result.push(matches[0]);
          result.push("");
        }

        if (matches.length > 1) {
          result.push(trailing);
        }

        if (matches.length === 0) {
          result.push("");
        }
      }
    } else {
      console.log("destory");
      if (words.length < phrase.length && words.length > 0) result.pop();
      result.push("");
    }

    if (
      result[result.length - 1].length === 0 &&
      (result.length === TOTAL_WORDS + 1 || result.length === 0)
    ) {
      result.pop();
    }

    setPhrase(result);

    if (phrase.length === TOTAL_WORDS && phrase[TOTAL_WORDS - 1] === "") {
      setPK(phrase);
    } else {
      setPK([]);
    }
  }

  return (
    <div className="w-full flex flex-col">
      <Input
        disabled={pk.length > 0}
        value={phrase.join(" ")}
        onChange={({ target: { value } }) => onChange(value)}
        type="text"
        placeholder="Private Key"
      />
    </div>
  );
}
