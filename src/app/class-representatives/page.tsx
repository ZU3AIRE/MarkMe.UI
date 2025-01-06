import { Button, Separator } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import { SquareArrowOutUpRight } from "lucide-react"
import { CRModel } from "../models/class-representative"

const ClassRepresentatives = async () => {

    let crs: CRModel[] = [];
    try {
        const res = await fetch('https://localhost:7177/api/cr/getallcrs');
        if (res.ok) crs = await res.json();
        else throw new Error("Failed to fetch courses");
    }
    catch (err) {
        console.error("Failed to fetch courses", err);
    }

    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold mb-4">
                        Class Representatives
                    </h1>
                </div>
            </div>
            <div className="gap-4 w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 justify-center px-8">
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
                                <Button variant={'outline'} className="ml-auto" size="icon"><SquareArrowOutUpRight /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground flex gap-1 flex-wrap mb-4">
                                {
                                    cr.courses?.map((course, index) => (
                                        <Badge variant={'outline'} key={index}>{course}</Badge>
                                    ))
                                }
                            </div>
                            <Separator />
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
                        {/* <CardFooter className="flex justify-end gap-4">
                            <Button variant="outline">Cancel</Button>
                            <Button>Details</Button>
                        </CardFooter> */}
                    </Card>
                ))}
            </div>
        </>
    )
}

export default ClassRepresentatives