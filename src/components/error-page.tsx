import { Link } from "@tanstack/react-router";
import { ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ErrorPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Error</EmptyTitle>
        <EmptyDescription>Something went wrong!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="cursor-pointer">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
