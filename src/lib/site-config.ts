import {
  AppleIcon,
  BookOpenIcon,
  ChefHatIcon,
  EarthIcon,
  FrameIcon,
  Settings2Icon,
  ShieldUserIcon,
} from "lucide-react";

export const siteConfig = {
  title: "Recipe App",
  description: "Manage your recipes.",
  image: "/pwa-512x512.png",
};

export const sidebarLinks = {
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
