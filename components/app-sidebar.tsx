"use client"

import type * as React from "react"

import {
    CopyPlus, History, ChartColumnIncreasing

} from "lucide-react"
import Image from "next/image";
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarRail } from "@/components/ui/sidebar"


// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "@/public/images/logo.webp",
    },
    navMain: [
        {
            title: "INPUT",
            url: "/dashboard",
            icon: CopyPlus,
        },
        {
            title: "HISTORY",
            url: "/dashboard/history",
            icon: History,
        },
        {
            title: "CHART DIAGRAM",
            icon: ChartColumnIncreasing,
            items: [
                {
                    title: "Bar Chart",
                    url: "/dashboard/barChart",
                },
                {
                    title: "Radar Chart",
                    url: "/dashboard/radarChart",
                },
            ],
        },
    ],
}

export function AppSidebar({ user, ...props }: { user: { nip: string, nama: string, avatar: string } } & React.ComponentProps<typeof Sidebar>) {


    return (
        <Sidebar collapsible="icon" {...props}>

            <SidebarContent>
                <SidebarGroup className="flex items-center">
                    <Image
                        src={"/images/logo.webp"}
                        alt="RS Elisabeth"
                        width={90}
                        height={0}
                    />
                    <SidebarGroupLabel>
                        <div className="text-base font-bold text-blue-300 ">
                            SUPERVISI KEPERAWTAN
                        </div>
                    </SidebarGroupLabel>
                </SidebarGroup>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

