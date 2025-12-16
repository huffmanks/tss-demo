import { createRouter } from "@tanstack/react-router";

import ErrorPage from "@/components/error-page";
import NotFoundPage from "@/components/not-found-page";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: () => <ErrorPage />,
    defaultNotFoundComponent: () => <NotFoundPage />,
  });

  return router;
};
