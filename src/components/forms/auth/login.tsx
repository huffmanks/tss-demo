import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/auth/auth-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = React.ComponentProps<"div"> & {
  doesOrganizationExist: boolean;
};

export function LoginForm({ doesOrganizationExist, className, ...props }: LoginFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "tim@mylab.com",
      password: "password",
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.signIn.email(value);

        if (error) {
          throw Error(error.message);
        }

        const session = await authClient.getSession();
        const orgId = session.data?.session.activeOrganizationId;
        const teamId = session.data?.session.activeTeamId;

        if (!doesOrganizationExist) {
          navigate({ to: "/onboarding/first-user" });
        } else if (!orgId || !teamId) {
          navigate({ to: "/onboarding/join" });
        } else {
          navigate({ to: "/$orgId/$teamId/dashboard/recipes", params: { orgId, teamId } });
        }
      } catch (error) {
        toast.error("Sign in failed.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
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
                name="email"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="password"
                children={(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
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
                  Login
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
