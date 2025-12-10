import * as React from "react";

import {
  BookOpenIcon,
  ChefHatIcon,
  CommandIcon,
  EarthIcon,
  FrameIcon,
  Settings2Icon,
} from "lucide-react";

import type { AuthUser } from "@/types";

import { NavMain } from "@/components/blocks/sidebar/nav-main";
import { NavSecondary } from "@/components/blocks/sidebar/nav-secondary";
import { NavUser } from "@/components/blocks/sidebar/nav-user";
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
      title: "Tags",
      url: "/dashboard/tags",
      icon: FrameIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2Icon,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthUser;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CommandIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Recipes</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
