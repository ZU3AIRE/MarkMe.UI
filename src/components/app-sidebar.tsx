"use client";

import { LifeBuoy, LucideProps, MonitorCog, Send } from "lucide-react";
import * as React from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import logo from "../../public/logo.png";
import { get } from "./class-representatives/form";

type NavItem = {
  title: string;
  url: string;
};

type NavMainItem = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isActive: boolean;
  items: NavItem[];
};

const navSecondary = [
  {
    title: "Support",
    url: "suppport",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "feedback",
    icon: Send,
  },
];

type Menu = {
  menuId: number;
  label: string;
  url: string;
  role: number;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [menus, setMenus] = useState<NavMainItem[]>([
    {
      title: "AMS - Tutor",
      url: "#",
      icon: MonitorCog,
      isActive: true,
      items: [] as NavItem[],
    },
  ]);

  const { getToken } = useAuth();
  const { addListener } = useClerk();
  const fetchToken = useCallback(
    async () => await getToken({ template: "mark_me_backend_api" }),
    [getToken]
  );
  const fetchData = useCallback(async () => {
    const token = await fetchToken();
    if (!token) return;
    await get<Menu[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}UserPermission/GetMenus`,
      (results) =>
        setMenus((prev) => [
          {
            ...prev.at(0)!,
            items: results.map((menu) => ({
              title: menu.label,
              url: menu.url,
            })),
          },
        ]),
      token
    );
  }, [fetchToken]);

  useEffect(() => {
    fetchData();
    const unsubscribe = addListener(fetchData);
    return () => unsubscribe();
  }, [fetchData, addListener]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={"/"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    className="size-8"
                    src={logo}
                    alt={"logo of mark-me"}
                    width={80}
                    height={80}></Image>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-md font-semibold">
                    Mark Me
                  </span>
                  <span className="truncate text-xs">
                    Let&apos;s mark everyone
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menus} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}
