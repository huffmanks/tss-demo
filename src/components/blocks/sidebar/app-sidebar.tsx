import type { ComponentProps } from "react";

import { Link } from "@tanstack/react-router";

import { authClient } from "@/auth/auth-client";
import { sidebarLinks } from "@/lib/site-config";
import { createAcronym } from "@/lib/utils";

import { NavMain } from "@/components/blocks/sidebar/nav-main";
import { NavSecondary } from "@/components/blocks/sidebar/nav-secondary";
import { NavUser } from "@/components/blocks/sidebar/nav-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarOrganizationHeader />
      <SidebarContent>
        <NavMain items={sidebarLinks.navMain} />
        <NavSecondary items={sidebarLinks.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarOrganizationHeader() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (!activeOrganization) return null;

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link to="/dashboard">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {createAcronym(activeOrganization.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrganization.name}</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
