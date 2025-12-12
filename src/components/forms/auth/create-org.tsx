import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { createFirstOrg } from "@/fn/onboarding";
import { cn, slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CreateOrgFormProps = React.ComponentProps<"div"> & {
  userId: string;
};

export function CreateOrgForm({ userId, className, ...props }: CreateOrgFormProps) {
  const [name, setName] = useState("My Family");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await createFirstOrg({
        data: {
          name,
          slug: slugify(name),
          userId,
        },
      });
      if (data?.id) {
        navigate({ to: "/dashboard/recipes" });
      }
    } catch (error) {
      toast.error("Creating organization failed!");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create organization</CardTitle>
          <CardDescription>Enter a title to create the first organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Organization name</FieldLabel>
                <Input
                  id="name"
                  type="name"
                  placeholder="My Family"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field>
                <Button className="cursor-pointer" type="submit">
                  Create
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
