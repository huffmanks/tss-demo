import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { createFirstOrg } from "@/fn/onboarding";
import { cn, slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CreateFirstOrgFormProps = React.ComponentProps<"div"> & {
  userId: string;
};

export function CreateFirstOrgForm({ userId, className, ...props }: CreateFirstOrgFormProps) {
  const navigate = useNavigate();
  const createFirstOrgFn = useServerFn(createFirstOrg);

  const form = useForm({
    defaultValues: {
      orgName: "My Org",
    },
    onSubmit: async ({ value }) => {
      try {
        const { orgName } = value;
        const orgSlug = slugify(orgName);
        const result = await createFirstOrgFn({
          data: { orgName, orgSlug, userId },
        });

        if (!result) {
          throw Error;
        }

        navigate({
          to: "/$orgId/dashboard",
          params: { orgId: result.organization.id },
        });
      } catch (error) {
        toast.error("Error creating organization.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create organization</CardTitle>
          <CardDescription>Create the first organization to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
            }}>
            <FieldGroup>
              <form.Field
                name="orgName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Organization name</FieldLabel>
                    <Input
                      id="name"
                      type="name"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

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
