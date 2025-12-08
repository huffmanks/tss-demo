import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import { Category } from "@/db/schema";
import { categoriesCollection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  category?: Category;
  handleClose: () => void;
  children: React.ReactNode;
}

export function CategoryForm({ category, handleClose, children }: CategoryFormProps) {
  const form = useForm({
    defaultValues: {
      title: category?.title ?? "",
      slug: category?.slug ?? "",
    },

    onSubmit: async ({ value }) => {
      try {
        if (category?.id) {
          categoriesCollection.update(category.id, (data) => {
            data.title = value.title;
            data.slug = value.slug;
          });
        } else {
          const id = uuidv7();
          categoriesCollection.insert({
            id,
            title: value.title,
            slug: value.slug,
          });
        }

        handleClose();
      } catch (error) {
        toast.error("Error submitting category.");
      }
    },
  });

  useLayoutEffect(() => {
    form.reset({
      title: category?.title ?? "",
      slug: category?.slug ?? "",
    });
  }, [category]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        form.setFieldValue("slug", slugify(form.getFieldValue("title")));
        await form.handleSubmit();
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
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        />
      </FieldGroup>
      {children}
    </form>
  );
}
