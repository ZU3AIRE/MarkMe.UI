"use client"
import { CRModel } from "@/app/models/class-representative";
import { timeAgo } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Input, Separator } from "../ui";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { get } from "./form";
import Nominate from "./nominate";
import UpdateCr from "./update";

const CRsCardGrid = ({ classRepresentatives }: { classRepresentatives: CRModel[] }) => {
    const [crs, setCrs] = useState<CRModel[]>(classRepresentatives);

    const loadCRs = () => {
        get<CRModel[]>('https://localhost:7177/api/cr/getallcrs',
            (data) => {
                setCrs(data);
            });
    }

    const onSuccess = () => {
        // loadData
        loadCRs();
    }


    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Filter courses..."
                        onChange={(event) =>
                            setCrs(classRepresentatives.filter(cr => cr.firstName?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.lastName?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.phoneNumber?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.courses?.some(course => course.label.toLowerCase().includes(event.target.value.toLowerCase()))))
                        }
                        className="max-w-sm"
                    />
                    <Nominate onSuccess={onSuccess} />
                </div>
            </div>
            <div className="gap-4 w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 justify-center pe-4 ps-8 pb-8">
                {crs.map((cr, _index) => (
                    <Card className="w-full" key={_index}>
                        <CardHeader>
                            <div className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={cr.avatar} alt={`Picture of ${cr.firstName}`} />
                                    <AvatarFallback>{cr.firstName?.[0]}{cr.lastName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-center">
                                    <CardTitle>{`${cr.firstName} ${cr.lastName}`}</CardTitle>
                                    <CardDescription><a href={`tel:${cr.phoneNumber}`}>{cr.phoneNumber}</a></CardDescription>
                                </div>

                                <UpdateCr courseIds={cr.courses.map(x => x.id)} onSuccess={onSuccess} student={{ ...cr }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground flex gap-1 flex-wrap mb-4">
                                {
                                    cr.courses?.map((course, index) => (
                                        <Badge variant={'outline'} key={index}>{course.label}</Badge>
                                    ))
                                }
                            </div>
                            <Separator />
                            {cr.activities?.length === 0 &&
                                <div
                                    className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 mt-4"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            No activity yet ...
                                        </p>
                                    </div>
                                </div>
                            }
                            <div className="mt-4">
                                {cr.activities?.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                    >
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {timeAgo(activity.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default CRsCardGrid