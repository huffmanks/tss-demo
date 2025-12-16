import { Link } from "@tanstack/react-router";
import { FileWarningIcon } from "lucide-react";

import { authClient } from "@/auth/auth-client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFoundPage() {
  const { data: session } = authClient.useSession();

  const link = {
    to: session ? "/dashboard" : "/login",
    label: session ? "Go to Dashboard" : "Go to Login",
  };

  return (
    <Empty className="from-muted/70 to-background h-full rounded-none bg-linear-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileWarningIcon />
        </EmptyMedia>
        <EmptyTitle>404 | Not Found</EmptyTitle>
        <EmptyDescription>Page does not exist!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="cursor-pointer">
          <Link to={link.to}>{link.label}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
