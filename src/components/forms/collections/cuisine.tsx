import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import type { Cuisine } from "@/db/schema/recipes";
import { cuisinesCollection } from "@/electric/collections";
import { simpleError } from "@/lib/error-handler";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CuisineFormProps {
  cuisine?: Cuisine;
  handleClose: () => void;
}

export function CuisineForm({ cuisine, handleClose }: CuisineFormProps) {
  const form = useForm({
    defaultValues: {
      title: cuisine?.title ?? "",
    },

    onSubmit: ({ value }) => {
      try {
        if (cuisine?.id) {
          cuisinesCollection.update(cuisine.id, (data) => {
            data.title = value.title;
          });
        } else {
          const id = uuidv7();
          cuisinesCollection.insert({
            id,
            title: value.title,
          });
        }

        handleClose();
      } catch (error) {
        const message = simpleError(error, "Error submitting cuisine.");
        toast.error(message);
      }
    },
  });

  useLayoutEffect(() => {
    form.reset({
      title: cuisine?.title ?? "",
    });
  }, [cuisine]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
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
          {cuisine ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
