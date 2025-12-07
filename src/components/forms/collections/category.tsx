import { useForm } from "@tanstack/react-form";

import { Category } from "@/db/schema";
import { categoriesCollection } from "@/lib/collections";
import { cn, slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CategoryFormProps = React.ComponentProps<"div"> & {
  category?: Category;
};

export function CategoryForm({ category, className, ...props }: CategoryFormProps) {
  const form = useForm({
    defaultValues: {
      title: category?.title ?? "",
      slug: category?.slug ?? "",
    },
    onSubmit: async ({ value }) => {
      const tempId = crypto.randomUUID();
      categoriesCollection.insert({
        id: tempId,
        title: value.title,
        slug: value.slug,
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
          <CardDescription>This will be used for recipes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <FieldGroup>
              <form.Field
                name="title"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      type="text"
                      required
                      value={field.state.value}
                      onBlur={() => {
                        field.handleBlur();
                        form.setFieldValue("slug", slugify(form.getFieldValue("title")));
                      }}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <Field>
                <Button className="cursor-pointer" type="submit">
                  {category ? "Update" : "Create"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
