import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authUser } from "@/fn/auth";
import { getOrganizationById } from "@/fn/collections/organizations";

import { AppSidebar } from "@/components/blocks/sidebar/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: DashboardRoute,
  loader: async ({ location }) => {
    const { user, session } = await authUser();

    if (!user.id) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    const orgId = session.activeOrganizationId;

    if (!orgId) return { user };

    const [organization] = await getOrganizationById({ data: { orgId } });

    return { user, organization };
  },
});

function DashboardRoute() {
  const { user, organization } = Route.useLoaderData();

  // TODO: if admin and no organization prompt user to create org first
  // if user redirect to /invite page and await invitation

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar user={user} organization={organization} />
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
