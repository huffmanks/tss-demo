import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { useLayoutEffect } from "@tanstack/react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

import type { Recipe } from "@/db/schema/recipes";
import { categoriesCollection, recipesCollection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

import MultipleSelector from "@/components/custom/multiple-selector";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RecipeFormProps {
  userId: string;
  organizationId: string;
  recipe?: Recipe;
}

export function RecipeForm({ userId, organizationId, recipe }: RecipeFormProps) {
  const { data: categoryData } = useLiveQuery((q) => q.from({ category: categoriesCollection }));

  const defaultValues = {
    title: recipe?.title ?? "",
    slug: recipe?.slug ?? "",
    description: recipe?.description ?? "",
    prepTime: recipe?.prepTime ?? "",
    cookTime: recipe?.cookTime ?? "",
    servingSize: recipe?.servingSize ?? "",
    authorNotes: recipe?.authorNotes ?? "",
    nutrition: recipe?.nutrition ?? [],
    category: categoryData.length
      ? categoryData.map((cat) => {
          return {
            label: cat.title,
            value: cat.id,
          };
        })
      : [],
  };

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      try {
        // create/update relations
        // recipeImages
        // categories
        // cuisines
        // tags
        // diets
        // ingredients and sections
        // instructions and sections

        if (recipe?.id) {
          recipesCollection.update(recipe.id, (data) => {
            data.title = value.title;
            data.slug = value.slug;
            data.description = value.description;
            data.prepTime = Number(value.prepTime);
            data.cookTime = Number(value.cookTime);
            data.servingSize = Number(value.servingSize);
          });
        } else {
          const id = uuidv7();
          recipesCollection.insert({
            id,
            userId,
            organizationId,
            ...value,
          });
        }
      } catch (error) {
        toast.error("Error submitting recipe.");
      }
    },
  });

  useLayoutEffect(() => {
    form.reset(defaultValues);
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
        <form.Field
          name="category"
          children={(field) => (
            <>
              <MultipleSelector
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
      </FieldGroup>
      <Button className="cursor-pointer" type="submit">
        {recipe ? "Update" : "Create"}
      </Button>
    </form>
  );
}
