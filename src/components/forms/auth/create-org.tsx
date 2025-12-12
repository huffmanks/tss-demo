import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/auth/auth-client";
import { cn, slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CreateOrgFormProps = React.ComponentProps<"div"> & {
  userId: string;
};

export function CreateOrgForm({ userId, className, ...props }: CreateOrgFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "My family",
    },

    onSubmit: async ({ value }) => {
      try {
        const { data, error } = await authClient.organization.create({
          name: value.name,
          slug: slugify(value.name),
          userId,
          keepCurrentActiveOrganization: false,
        });

        if (error) {
          toast.error("Error creating organization.");
        }

        if (data) {
          navigate({ to: "/dashboard/recipes" });
        }
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
          <CardDescription>Enter a title to create the first organization.</CardDescription>
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
                name="name"
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
