import { createRouter } from "@tanstack/react-router";

import ErrorPage from "@/components/error-page";
import NotFound from "@/components/not-found";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: () => <ErrorPage />,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
};
