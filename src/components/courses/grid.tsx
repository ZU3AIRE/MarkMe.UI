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

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Course, DEFAULT_COURSE } from "../../app/models/course";

export default function CourseGrid({ courses }: { courses: Course[] }) {
    // Table Setup
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    // Modal Open State Variables
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<Course>(DEFAULT_COURSE);

    const columns: ColumnDef<Course>[] = [
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
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Course Title
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize ml-4">{row.getValue("title")}</div>
            ),
        },
        {
            accessorKey: "teacher",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Teacher
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize ml-4">{row.getValue("teacher")}</div>
            ),
        },
        {
            accessorKey: "courseCode",
            header: () => <div>Course Code</div>,
            cell: ({ row }) => {
                return <div>{row.getValue("courseCode")}</div>;
            },
        },
        {
            accessorKey: "courseType",
            header: () => <div>Course Type</div>,
            cell: ({ row }) => {
                return row.getValue("courseType")!.toString() == Course.types.MAJOR ?
                    <Badge variant="outline" className="font-normal" >MAJOR</Badge> :
                    <Badge variant="outline" className="font-normal">MINOR</Badge>
            },
        },
        {
            accessorKey: "creditHours",
            header: () => <div>Credit Hours</div>,
            cell: ({ row }) => {
                return <div>{row.getValue("creditHours")}</div>;
            },
        },
        {
            accessorKey: "creditHoursPerWeek",
            header: () => <div>Credit Hours/Week</div>,
            cell: ({ row }) => {
                return <div>{row.getValue("creditHoursPerWeek")}</div>;
            },
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
                            navigator.clipboard.writeText(course.courseCode.toString());
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
                            redirect(`/courses/update/${course.id}`);
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
        data: courses,
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

    const onCourseDeleted = (course: Course) => {
        setIsDeleteModalOpen(false);
        toast.warning(`${course.title} deleted successfully!`);
    };

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
                            .map((column: Column<Course>) => {
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
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
                                    {selectedForDeletion.courseCode}: {selectedForDeletion.title}
                                </span>
                                {selectedForDeletion.teacher ? ` taught by ${selectedForDeletion.teacher}` : ""}
                                {`?`}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <footer className="text-end h-8">
                        <Button onClick={() => setIsDeleteModalOpen(false)}>
                            <CircleXIcon />
                            Cancel
                        </Button>{" "}
                        <Button onClick={() => onCourseDeleted(selectedForDeletion)} variant="destructive">
                            <Trash2 />
                            Delete
                        </Button>
                    </footer>
                </DialogContent>
            </Dialog>
        </>
    )
};