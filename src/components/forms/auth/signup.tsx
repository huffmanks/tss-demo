import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { authClient } from "@/auth/auth-client";
import { createAdminUser, createFirstOrganization, seedNewOrganizationData } from "@/fn/onboarding";
import { slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignupFormProps = React.ComponentProps<typeof Card>;

export function SignupForm({ ...props }: SignupFormProps) {
  const navigate = useNavigate();
  const createAdminUserFn = useServerFn(createAdminUser);
  const createFirstOrganizationFn = useServerFn(createFirstOrganization);
  const seedNewOrganizationDataFn = useServerFn(seedNewOrganizationData);

  const form = useForm({
    defaultValues: {
      name: "Tim Lab",
      email: "tim@mylab.com",
      password: "password",
      confirmPassword: "password",
      organizationName: "My family",
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.password !== value.confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }

        const { user } = await createAdminUserFn({
          data: {
            name: value.name,
            email: value.email,
            password: value.password,
          },
        });

        if (!user.id) throw Error;

        const organizationSlug = slugify(value.organizationName);

        const organization = await createFirstOrganizationFn({
          data: { organizationName: value.organizationName, organizationSlug, userId: user.id },
        });

        if (!organization?.id) throw Error;

        await seedNewOrganizationDataFn({ data: { organizationId: organization.id } });

        await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        navigate({ to: "/dashboard" });
      } catch (error) {
        toast.error("Error signing up.");
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          autoComplete="off"
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
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="off"
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="off"
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email with anyone
                    else.
                  </FieldDescription>
                </Field>
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="off"
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>
              )}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="off"
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
              )}
            />

            <form.Field
              name="organizationName"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="organizationName">Organization name</FieldLabel>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="My family"
                    autoComplete="off"
                    required
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button className="cursor-pointer" type="submit">
                  Create Account
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
