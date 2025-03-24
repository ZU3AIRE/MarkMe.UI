"use client";
import { ActionButton, Actions, SmartSelect } from "@/components/re-useables";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    CircleXIcon,
    PlusIcon,
    SquarePen,
    Trash2
} from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CourseModel, CourseType } from '../../app/models/course';
import { Badge } from "../ui/badge";

export default function CourseGrid({ courses }: { courses: CourseModel[] }) {
    // Table Setup
    const [data, setData] = useState<CourseModel[]>(courses);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    // Modal Open State Variables
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<CourseModel | null>(null);
    const columns: ColumnDef<CourseModel>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        // 'code'
        {
            accessorKey: "code", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Course Code <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => {
                let code = row.getValue<string>("code")
                if (!code) return "";
                code = `${code.substring(0, 2)}-${code.substring(2)}`
                return (<div className="text-center capitalize">{code}</div>)
            }
        },//'title'
        {
            accessorKey: "title", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Course Title <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => (<div className="text-center capitalize">{row.getValue("title")}</div>)
        },//'type'
        {
            accessorKey: "type", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Course Type <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => (<Badge className={row.getValue("type") === CourseType.MAJOR ? "bg-red-50" : "bg-green-50"} variant={'outline'}><div className="text-center capitalize">{CourseType[parseInt(row.getValue("type"))]}</div></Badge>)
        },// 'semester'
        {
            accessorKey: "semester", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Semester <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => (<div className="text-center capitalize">{row.getValue("semester")}</div>)
        },// 'creditHours'
        {
            accessorKey: "creditHours", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Credit Hours <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => (<div className="text-center capitalize">{row.getValue("creditHours")}</div>)
        },//   'creditHoursPerWeek'
        {
            accessorKey: "creditHoursPerWeek", header: ({ column }) => {
                return (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Credit Hours/Week <ArrowUpDown /> </Button>);
            },
            cell: ({ row }) => (<div className="text-center capitalize">{row.getValue("creditHoursPerWeek")}</div>)
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const course = row.original;
                const tableActions: Actions[] = [
                    {
                        key: "copy",
                        label: <>Copy Course Code</>,
                        onClick: () => {
                            navigator.clipboard.writeText(course.code);
                        },
                    },
                    {
                        key: "separator",
                        label: "",
                        onClick: () => { },
                    },
                    {
                        key: "edit",
                        label: (
                            <>
                                <SquarePen /> Edit
                            </>
                        ),
                        onClick: () => {
                            redirect(`/courses/update/${course.courseId}`);
                        }
                    },
                    {
                        key: "delete",
                        label: (
                            <>
                                <Trash2 /> Delete
                            </>
                        ),
                        variant: 'destructive',
                        onClick: () => {
                            if (!course) { toast.error("Unable to select for deletion"); return; };
                            setSelectedForDeletion(course);
                            setIsDeleteModalOpen(true);
                        },
                    },
                ];
                return (
                    <ActionButton items={tableActions} ></ActionButton>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const onCourseDeleted = (course: CourseModel) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Course/DeleteCourse/${course.courseId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while deleting the course.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .then((data: CourseModel | null) => {
                if (!data) return;

                toast.warning(`${course.title} deleted successfully!`);
                console.log("✅ Updated: ", data);
                setIsDeleteModalOpen(false);
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Course/GetAllCourses`)
                    .then(res => {
                        if (!res.ok) {
                            switch (res.status) {
                                case 400:
                                    toast.error("Invalid data was provided.");
                                    break;
                                default:
                                    toast.error("An error occurred while deleting the course.");
                                    break;
                            }
                        }
                        return res.ok ? res.json() : null;
                    }).then(res => {
                        setData(res);
                    }).
                    catch(err => {
                        console.error("Failed to fetch courses", err);
                    });
            })
            .catch((error: Error) => {
                toast.error("An error occurred while deleting the course.");
                console.log('🐛 ', error);
            });
    }

    return (
        <>
            <div className="flex items-center justify-between py-4">
                <h1 className="text-2xl font-semibold">
                    Courses
                </h1>
                <Link href="/courses/new">
                    <Button variant="outline">
                        <PlusIcon />  Add
                    </Button>
                </Link>
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter courses..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="ml-auto">
                    <SmartSelect
                        items={table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column: Column<CourseModel>) => {
                                return {
                                    key: column.id,
                                    label: column.id,
                                    isChecked: column.getIsVisible(),
                                };
                            })}
                        onCheckedChange={(item, value) =>
                            table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .find((coulmn) => coulmn.id == item.key)
                                ?.toggleVisibility(!!value)
                        }
                        title="Columns"
                        variant={"outline"}
                        key={"id"}
                    ></SmartSelect>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ textAlign: "center" }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ textAlign: "center" }}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Delete Confirm Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete</DialogTitle>
                        <DialogDescription>
                            <span className="mt-3 mb-3 border-l-2 pl-3 italic">
                                <span className="font-semibold">
                                    {selectedForDeletion?.code}: {selectedForDeletion?.title}?
                                </span>
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <footer className="text-end h-8">
                        <Button onClick={() => setIsDeleteModalOpen(false)}>
                            <CircleXIcon />
                            Cancel
                        </Button>{" "}
                        <Button onClick={() => { if (selectedForDeletion) onCourseDeleted(selectedForDeletion) }} variant="destructive">
                            <Trash2 />
                            Delete
                        </Button>
                    </footer>
                </DialogContent>
            </Dialog>
        </>
    )
};