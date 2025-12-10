import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";

import { AppSidebar } from "@/components/blocks/sidebar/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const authUser = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
});

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardRoute,
  loader: async ({ location }) => {
    const user = await authUser();

    if (!user.id) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { user };
  },
});

function DashboardRoute() {
  const { user } = Route.useLoaderData();
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar user={user} />
          <SidebarInset>
            <div className="p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
