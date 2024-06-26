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

export const Route = createFileRoute("/auth")({ component: Component });

function Component() {
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
          <Input type="text" placeholder="Username" />
          <Button>Let me in</Button>
        </CardContent>
        <CardFooter>
          Don't have an account yet? <Button variant="link">Sign me up</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
