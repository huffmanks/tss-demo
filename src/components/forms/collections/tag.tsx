import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import type { Tag } from "@/db/schema/recipes";
import { tagsCollection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface TagFormProps {
  tag?: Tag;
  handleClose: () => void;
}

export function TagForm({ tag, handleClose }: TagFormProps) {
  const form = useForm({
    defaultValues: {
      title: tag?.title ?? "",
      slug: tag?.slug ?? "",
    },

    onSubmit: ({ value }) => {
      try {
        if (tag?.id) {
          tagsCollection.update(tag.id, (data) => {
            data.title = value.title;
            data.slug = value.slug;
          });
        } else {
          const id = uuidv7();
          tagsCollection.insert({
            id,
            title: value.title,
            slug: value.slug,
          });
        }

        handleClose();
      } catch (error) {
        toast.error("Error submitting tag.");
      }
    },
  });

  useLayoutEffect(() => {
    form.reset({
      title: tag?.title ?? "",
      slug: tag?.slug ?? "",
    });
  }, [tag]);

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
      <DialogFooter>
        <DialogClose asChild>
          <Button className="cursor-pointer" type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button className="cursor-pointer" type="submit">
          {tag ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
