import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";

import { AppSidebar } from "@/components/blocks/sidebar/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardRoute,
  loader: async ({ location }) => {
    const { user, orgId } = await authUser();

    if (!user.id) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { user, orgId };
  },
});

function DashboardRoute() {
  const { user, orgId } = Route.useLoaderData();
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar user={user} orgId={orgId} />
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
