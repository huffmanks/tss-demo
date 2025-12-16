import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";

import { AppSidebar } from "@/components/blocks/sidebar/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardRoute,
  beforeLoad: async ({ location }) => {
    const { session } = await authUser();

    if (!session.id) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});

function DashboardRoute() {
  // TODO: if admin and no organization prompt user to create org first
  // if user redirect to /invite page and await invitation

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
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
