import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/auth/auth-client";
import { simpleError } from "@/lib/error-handler";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const form = useForm({
    defaultValues: {
      email: "tim@mylab.com",
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.requestPasswordReset(value);

        if (error) {
          throw Error(error.message);
        }
      } catch (error) {
        const message = simpleError(error, "Sign in failed.");
        toast.error(message);
      }
    },
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
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
                  </Field>
                )}
              />

              <Field>
                <Button className="cursor-pointer" type="submit">
                  Reset
                </Button>

                <FieldDescription className="text-center">
                  Remembered your password? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
