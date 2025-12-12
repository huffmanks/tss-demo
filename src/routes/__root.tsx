import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { siteConfig } from "@/lib/site-config";
import appCss from "@/styles.css?url";

import ErrorPage from "@/components/error-page";
import NotFound from "@/components/not-found";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: siteConfig.title,
      },
      {
        name: "title",
        content: siteConfig.title,
      },
      {
        name: "description",
        content: siteConfig.description,
      },
      {
        property: "og:type",
        content: "website",
      },
      // {
      //   property: "og:url",
      //   content: currentUrl
      // },
      {
        property: "og:title",
        content: siteConfig.title,
      },
      {
        property: "og:description",
        content: siteConfig.description,
      },
      {
        property: "og:image",
        content: siteConfig.image, // currentImage
      },
      {
        property: "og:image:width",
        content: "512",
      },
      {
        property: "og:image:height",
        content: "512",
      },
      {
        property: "og:image:alt",
        content: siteConfig.description,
      },
      {
        property: "twitter:card",
        content: "summary_large_image",
      },
      // {
      //   property: "twitter:url",
      //   content: currentUrl
      // },
      {
        property: "twitter:title",
        content: siteConfig.title,
      },
      {
        property: "twitter:description",
        content: siteConfig.description,
      },
      {
        property: "twitter:image",
        content: siteConfig.image, // currentImage
      },
      {
        property: "twitter:image:alt",
        content: siteConfig.description,
      },
    ],
    links: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon-180x180.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: () => <ErrorPage />,
  notFoundComponent: () => <NotFound />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  );
}
