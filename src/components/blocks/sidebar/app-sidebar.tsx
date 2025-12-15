import type { ComponentProps } from "react";

import { Link } from "@tanstack/react-router";
import type { Organization } from "better-auth/plugins";
import {
  AppleIcon,
  BookOpenIcon,
  ChefHatIcon,
  EarthIcon,
  FrameIcon,
  Settings2Icon,
  ShieldUserIcon,
} from "lucide-react";

import { createAcronym } from "@/lib/utils";
import type { AuthUser } from "@/types";

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

const data = {
  navMain: [
    {
      title: "Recipes",
      url: "/dashboard/recipes",
      icon: ChefHatIcon,
      isActive: true,
      items: [
        {
          title: "Add",
          url: "/dashboard/recipes/add",
        },
        {
          title: "Favorites",
          url: "/dashboard/recipes/favorites",
        },
        {
          title: "Shared",
          url: "/dashboard/recipes/shared",
        },
      ],
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: BookOpenIcon,
    },
    {
      title: "Cuisines",
      url: "/dashboard/cuisines",
      icon: EarthIcon,
    },
    {
      title: "Diets",
      url: "/dashboard/diets",
      icon: AppleIcon,
    },
    {
      title: "Tags",
      url: "/dashboard/tags",
      icon: FrameIcon,
    },
  ],
  navSecondary: [
    {
      title: "Admin",
      url: "/admin",
      icon: ShieldUserIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2Icon,
    },
  ],
};

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user: AuthUser;
  organization?: Organization;
};

export function AppSidebar({ user, organization, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      {organization && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {createAcronym(organization.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{organization.name}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
