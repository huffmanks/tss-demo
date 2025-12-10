import { useState } from "react";

import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import type { Recipe } from "@/db/schema/recipes";
import { categoriesCollection, recipesCollection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

import ComboboxMultiSelect from "@/components/custom/combobox-multi-select";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CategoryForm } from "./category";

interface RecipeFormProps {
  userId: string;
  recipe?: Recipe;
}

export function RecipeForm({ userId, recipe }: RecipeFormProps) {
  const [open, setOpen] = useState(false);

  const { data: categories } = useLiveQuery((q) => q.from({ category: categoriesCollection }));

  const form = useForm({
    defaultValues: {
      title: recipe?.title ?? "",
      slug: recipe?.slug ?? "",
      description: recipe?.description ?? "",
      image: recipe?.image ?? "",
      prepTime: recipe?.prepTime ?? "",
      cookTime: recipe?.cookTime ?? "",
      totalTime: recipe?.totalTime ?? "",
      servingSize: recipe?.servingSize ?? "",
      categoryId: recipe?.categoryId ?? "",
    },

    onSubmit: ({ value }) => {
      try {
        if (recipe?.id) {
          recipesCollection.update(recipe.id, (data) => {
            data.title = value.title;
            data.slug = value.slug;
            data.description = value.description;
            data.image = value.image;
            data.prepTime = value.prepTime;
            data.cookTime = value.cookTime;
            data.totalTime = value.totalTime;
            data.servingSize = value.servingSize;
            data.categoryId = value.categoryId;
          });
        } else {
          const id = uuidv7();
          recipesCollection.insert({
            id,
            userId,
            ...value,
          });
        }
      } catch (error) {
        toast.error("Error submitting recipe.");
      }
    },
  });

  function handleClose() {
    setOpen(false);
  }

  useLayoutEffect(() => {
    form.reset({
      title: recipe?.title ?? "",
      slug: recipe?.slug ?? "",
      description: recipe?.description ?? "",
      image: recipe?.image ?? "",
      prepTime: recipe?.prepTime ?? "",
      cookTime: recipe?.cookTime ?? "",
      totalTime: recipe?.totalTime ?? "",
      servingSize: recipe?.servingSize ?? "",
      categoryId: recipe?.categoryId ?? "",
    });
  }, [recipe]);

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
        <form.Field
          name="description"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        />

        <form.Field
          name="image"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="image">Image</FieldLabel>
              <Input
                id="image"
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

      <FieldGroup>
        <form.Field
          name="prepTime"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="prepTime">Prep time</FieldLabel>
              <Input
                id="prepTime"
                type="text"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        />

        <form.Field
          name="cookTime"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="cookTime">Cook time</FieldLabel>
              <Input
                id="cookTime"
                type="text"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        />

        <form.Field
          name="totalTime"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="totalTime">Total time</FieldLabel>
              <Input
                id="totalTime"
                type="text"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        />

        <form.Field
          name="servingSize"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="servingSize">Serving size</FieldLabel>
              <Input
                id="servingSize"
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

      <FieldGroup>
        <ComboboxMultiSelect
          singularLabel="Category"
          pluralLabel="Categories"
          items={categories}
          formComponent={<CategoryForm handleClose={handleClose} />}
        />
      </FieldGroup>
      <Button className="cursor-pointer" type="submit">
        {recipe ? "Update" : "Create"}
      </Button>
    </form>
  );
}
