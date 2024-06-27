import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/app/utils.ts";

export const Route = createFileRoute("/auth")({ component: Component });

function Component() {
  const [username, setUsername] = useState("");

  return (
    <div className="flex-grow w-full flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            Sign in to your account to access your notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 my-4">
          <Input
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
            type="text"
            placeholder="Username"
          />
          <Button onClick={() => api.users.get.post({ username })}>
            Sign in
          </Button>
        </CardContent>
        <CardFooter>
          Don't have an account yet?{" "}
          <Button
            variant="link"
            onClick={() => api.users.create.post({ username, secretKey: "" })}
          >
            Sign me up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
