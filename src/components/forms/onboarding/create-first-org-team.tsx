import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { createFirstOrgTeam } from "@/fn/onboarding";
import { cn, slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CreateFirstOrgTeamFormProps = React.ComponentProps<"div"> & {
  doesOrganizationExist: boolean;
  userId: string;
};

export function CreateFirstOrgTeamForm({
  doesOrganizationExist,
  userId,
  className,
  ...props
}: CreateFirstOrgTeamFormProps) {
  const navigate = useNavigate();
  const createFirstOrgTeamFn = useServerFn(createFirstOrgTeam);

  const form = useForm({
    defaultValues: {
      orgName: "My Org",
      teamName: "My Team",
    },
    onSubmit: async ({ value }) => {
      try {
        const { orgName, teamName } = value;
        const orgSlug = slugify(orgName);
        const teamSlug = slugify(teamName);
        const result = await createFirstOrgTeamFn({
          data: { orgName, orgSlug, teamName, teamSlug, userId },
        });

        if (!result) {
          throw Error;
        }

        navigate({
          to: "/$orgId/$teamId/dashboard",
          params: { orgId: result.organization.id, teamId: result.team.id },
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
          <CardTitle>Create organization/team</CardTitle>
          <CardDescription>Create the first organization and team to get started.</CardDescription>
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

              <form.Field
                name="teamName"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Team name</FieldLabel>
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
