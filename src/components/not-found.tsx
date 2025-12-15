import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>404 | Not Found</EmptyTitle>
        <EmptyDescription>Page does not exist!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="cursor-pointer">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
