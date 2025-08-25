'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export const Breadcrumbs = () => {
    const paths: string = usePathname();
    const pathNames: string[] = paths.split('/').filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    {paths === "/" || paths === "/attendance" ?
                        <BreadcrumbPage>
                            Attendance
                        </BreadcrumbPage> :
                        <BreadcrumbLink asChild>
                            <Link href={"/"}>Attendance </Link>
                        </BreadcrumbLink>
                    }
                </BreadcrumbItem>
                {
                    pathNames.map((link, index) => {
                        const href: string = `/${pathNames.slice(0, index + 1).join('/')}`;
                        const linkName: string = link[0].toUpperCase() + link.slice(1, link.length);
                        const isLastPath: boolean = pathNames.length === index + 1;

                        if (linkName === "attendance" || href === "/attendance") {
                            return null;
                        }
                        return (
                            <Fragment key={index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    {isLastPath ?
                                        <BreadcrumbPage>{linkName}</BreadcrumbPage> :
                                        <BreadcrumbLink asChild>
                                            <Link href={href}>{linkName}</Link>
                                        </BreadcrumbLink>
                                    }
                                </BreadcrumbItem>
                            </Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    );
}