import { Link, useLocation } from "@tanstack/react-router";
import { SidebarIcon } from "lucide-react";

import { createLabel } from "@/lib/utils";

import { SearchForm } from "@/components/blocks/sidebar/search-form";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");

    return {
      to: path,
      label: createLabel(segment),
    };
  });

  const itemsLength = items.length;

  function generateLayers() {
    if (itemsLength < 4) {
      return {
        links: items.slice(0, -1),
        collapsed: null,
        page: items[itemsLength - 1],
      };
    }

    return {
      links: [items[0]],
      collapsed: items.slice(1, -1),
      page: items[itemsLength - 1],
    };
  }

  const layers = generateLayers();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {layers.links.map((item) => (
              <BreadcrumbLinkOrPage key={item.to} item={item} itemType="link" />
            ))}
            {layers.collapsed && (
              <>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex items-center gap-1"
                      aria-label="Toggle menu">
                      <BreadcrumbEllipsis className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {layers.collapsed.map((item) => (
                        <DropdownMenuItem key={item.to}>
                          <Link to={item.to}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            <BreadcrumbLinkOrPage item={layers.page} itemType="page" />
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}

interface BreadcrumbLinkOrPageProps {
  item: {
    to: string;
    label: string;
  };
  itemType: "link" | "collapsible" | "page";
}

function BreadcrumbLinkOrPage({ item, itemType }: BreadcrumbLinkOrPageProps) {
  return (
    <>
      <BreadcrumbItem>
        {itemType === "link" ? (
          <BreadcrumbLink href={item.to}>{item.label}</BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        )}
      </BreadcrumbItem>

      {itemType === "link" && <BreadcrumbSeparator />}
    </>
  );
}
