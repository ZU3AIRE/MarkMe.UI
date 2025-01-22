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
import { usePathname } from "next/navigation";

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
  const path = usePathname();
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items?.map((item, index) => (
          <div key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            {item.items?.map((subitem, index) => (
              <SidebarMenuItem key={index} className="mb-1">
                <SidebarMenuButton
                  asChild
                  tooltip={subitem.title}
                  className={path.includes(subitem.url) ? "bg-gray-200" : ""}>
                  <span className="cursor-pointer select-none">
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
