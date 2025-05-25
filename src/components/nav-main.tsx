"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item, index) => (
          <div key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            {item.items?.map((subitem, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild tooltip={subitem.title}>
                  <span>
                    <ChevronRight />
                    <Link href={subitem.url}>
                      <span>{subitem.title}</span>
                    </Link>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
