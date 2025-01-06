"use client"

import {
  CalendarCheck,
  LifeBuoy,
  MonitorCog,
  Send
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image";
import logo from "../../public/logo.png";


const data = {
  navMain: [
    {
      title: "Attendence",
      url: "#",
      icon: CalendarCheck,
      isActive: true,
      items: [
        {
          title: "Mark Attendence",
          url: "attendance",
        },
        {
          title: "Export/Share",
          url: "export",
        },
      ],
    },
    {
      title: "System Management",
      url: "system-management",
      icon: MonitorCog,
      items: [
        {
          title: "Courses",
          url: "courses",
        },
        {
          title: "Students",
          url: "students",
        },
        {
          title: "Class Representatives",
          url: "class-representatives",
        },
      ],
    },

  ],
  navSecondary: [
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
  ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> ) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={"/"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image className="size-8" src={logo} alt={"logo of mark-me"} width={80} height={80}></Image>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-md font-semibold">Mark Me</span>
                  <span className="truncate text-xs">Let&apos;s mark everyone</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  )
}
