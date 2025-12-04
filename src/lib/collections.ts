import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";

import { todoSchema } from "@/db/entities";
import { createTodo, deleteTodo, updateTodo } from "@/fn/todos";

// Construct absolute URL for Electric sync
// In browser: uses window.location.origin
// Fallback for SSR or other contexts
const getElectricUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/electric`;
  }
  // Fallback for SSR (shouldn't be used since dashboard has ssr: false)
  return process.env.VITE_APP_URL
    ? `${process.env.VITE_APP_URL}/api/electric`
    : "http://localhost:3000/api/electric";
};

export const todosCollection = createCollection(
  electricCollectionOptions({
    id: "todos",
    schema: todoSchema,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table: "todos" },
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const newItem = transaction.mutations[0].modified;
      const { txid } = await createTodo({ data: newItem });
      return { txid };
    },

    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0];
      const { txid } = await updateTodo({
        data: { ...changes, id: original.id },
      });
      return { txid };
    },

    onDelete: async ({ transaction }) => {
      const deletedItem = transaction.mutations[0].original;
      const { txid } = await deleteTodo({
        data: { id: deletedItem.id },
      });
      return { txid };
    },
  })
);
