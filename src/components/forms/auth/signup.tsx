import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { authClient } from "@/auth/auth-client";
import { createAdminUser, createUser } from "@/fn/onboarding";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignupFormProps = React.ComponentProps<typeof Card> & {
  doesOrganizationExist: boolean;
  doesUserExist: boolean;
};

export function SignupForm({ doesOrganizationExist, doesUserExist, ...props }: SignupFormProps) {
  const navigate = useNavigate();
  const createAdminUserFn = useServerFn(createAdminUser);
  const createUserFn = useServerFn(createUser);

  const form = useForm({
    defaultValues: {
      name: "Tim Lab",
      email: "tim@mylab.com",
      password: "password",
      confirmPassword: "password",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const { confirmPassword, ...rest } = value;

      if (!doesUserExist) {
        await createAdminUserFn({ data: rest });
      } else {
        await createUserFn({ data: rest });
      }

      await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (!doesOrganizationExist) {
        navigate({ to: "/onboarding/first-user" });
      } else {
        navigate({ to: "/onboarding/join" });
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
