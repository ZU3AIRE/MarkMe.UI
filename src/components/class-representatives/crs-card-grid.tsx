"use client"
import { StudentModel } from "@/app/class-representatives/page";
import { CRModel } from "@/app/models/class-representative";
import { timeAgo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, CircleXIcon, PlusIcon, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage, Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator } from "../ui";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

const FormSchema = z.object({
    studentId: z.preprocess((x) => parseInt(x as unknown as string), z.number().int().positive()),
    courseIds: z.array(z.boolean().default(false)).optional(),
})

const CRsCardGrid = ({ classRepresentatives, courses, students }: {
    classRepresentatives: CRModel[],
    courses: { value: number, label: string, code: string }[]
    students:  StudentModel[]
}) => {
console.log(students)
    const [crs, setCrs] = useState<CRModel[]>(classRepresentatives);
    const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentId: 0,
            courseIds: Array(courses.length).fill(false)
        }
    });

    const loadCourses = () => {
        fetch('https://localhost:7177/api/cr/getallcrs')
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch courses");
            return res.json();
        })
        .then((data) => {
            setCrs(data);
        })
        .catch((err) => {
            console.error("Failed to fetch courses", err);
        });
    }

    const onNominate = (formData: z.infer<typeof FormSchema>) => {
        const reqBody = { studentId: formData.studentId, courseIds: formData.courseIds!.map((checked, index) => checked && courses.at(index)?.value).filter(Boolean)};
        fetch('https://localhost:7177/api/CR/NominateCR', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(reqBody) })
            .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while creating the course.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .then((data: CRModel | null) => {
                if (!data) return;

                toast.success(`A new ${data.firstName} ${data.lastName} has been created successfully.`);
                console.log("✅ Added: ", data);

                // loadData
                loadCourses()
                setIsNominateModalOpen(false);
            })
            .catch((error: Error) => {
                toast.error("An error occurred while creating the course.");
                console.log('🐛 ', error);
            });
    }


    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Filter courses..."
                        onChange={(event) =>
                            setCrs(classRepresentatives.filter(cr => cr.firstName?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.lastName?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.phoneNumber?.toLowerCase().includes(event.target.value.toLowerCase()) || cr.courses?.some(course => course.toLowerCase().includes(event.target.value.toLowerCase()))))
                        }
                        className="max-w-sm"
                    />
                    <Button onClick={() => { setIsNominateModalOpen(true) }}><PlusIcon /> Nominate</Button>
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
                        {/* <CardFooter className="flex justify-end gap-4">
                            <Button variant="outline">Cancel</Button>
                            <Button>Details</Button>
                        </CardFooter> */}
                    </Card>
                ))}
            </div>

            {/* Nominate new CR */}
            <Dialog open={isNominateModalOpen} onOpenChange={setIsNominateModalOpen}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader >
                        <DialogTitle>Nomiate Class Representative</DialogTitle>
                        <DialogDescription>
                            Select the course you wish to nominate a class representative for.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onNominate)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select any of your student" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {students.map((student, index) => (
                                                    <SelectItem key={index} value={student?.studentId.toString()}>
                                                        {student?.firstName}{" "}{student?.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <ScrollArea className="h-[350px] p-4 border border-gray-200 rounded-lg">
                                {courses.map((course, index) => (
                                    <div
                                        key={index}
                                        className="my-2"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`courseIds.${index}`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4  shadow">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            {course.code}
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {course.label}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </ScrollArea>
                            <footer className="text-end h-8">
                                <Button onClick={() => setIsNominateModalOpen(false)} variant={'secondary'}>
                                    <CircleXIcon />
                                    Cancel
                                </Button>{" "}
                                <Button onClick={() => { }} variant="default" className="bg-green-600 hover:bg-green-400" type="submit">
                                    <CheckCircle2Icon />
                                    Nominate
                                </Button>
                            </footer>
                        </form>
                    </Form>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default CRsCardGrid