"use client";
import { Button } from "@/components/ui";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Header() {
    const path = usePathname();
    console.log(path)
    return (
        <>
            <div className="flex items-center justify-between py-4">
                <h1 className="text-2xl font-semibold">Courses</h1>
                {
                    path.startsWith("/courses/new/") || path.startsWith("/courses/update/") ?
                        <Link href="/courses">
                            <Button variant="outline">
                                <ArrowLeftIcon />  Back
                            </Button>
                        </Link>
                        :
                        <Link href="/courses/new">
                            <Button variant="outline">
                                <PlusIcon /> Add
                            </Button>
                        </Link>
                }
            </div>
        </>
    );
}