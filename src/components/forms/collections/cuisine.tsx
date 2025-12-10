import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import type { Cuisine } from "@/db/schema/recipes";
import { cuisinesCollection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CuisineFormProps {
  cuisine?: Cuisine;
  handleClose: () => void;
  children: React.ReactNode;
}

export function CuisineForm({ cuisine, handleClose, children }: CuisineFormProps) {
  const form = useForm({
    defaultValues: {
      title: cuisine?.title ?? "",
      slug: cuisine?.slug ?? "",
    },

    onSubmit: ({ value }) => {
      try {
        if (cuisine?.id) {
          cuisinesCollection.update(cuisine.id, (data) => {
            data.title = value.title;
            data.slug = value.slug;
          });
        } else {
          const id = uuidv7();
          cuisinesCollection.insert({
            id,
            title: value.title,
            slug: value.slug,
          });
        }

        handleClose();
      } catch (error) {
        toast.error("Error submitting cuisine.");
      }
    },
  });

  useLayoutEffect(() => {
    form.reset({
      title: cuisine?.title ?? "",
      slug: cuisine?.slug ?? "",
    });
  }, [cuisine]);

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
