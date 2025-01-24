"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import React, { useState } from "react"

import { SmartSelect } from "@/components/re-useables"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CourseDropdownModel, IAttendance } from '@/app/models/attendance'
import { CourseModel } from "@/app/models/course"

const columns: ColumnDef<IAttendance>[] = [
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
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: "universityRollNo",
        header: "University Roll Number",
        cell: ({ row }) => <div className="ml-7">{row.getValue("universityRollNo")}</div>,
    },
    {
        accessorKey: "collegeRollNo",
        header: "College Roll Number",
        cell: ({ row }) => <div className="ml-7">{row.getValue("collegeRollNo")}</div>,
    },
    {
        accessorKey: "semester",
        header: "Semester",
        cell: ({ row }) => <div className="ml-7">{row.getValue("semester")}</div>,
    },
    {
        accessorKey: "courseCode",
        header: "Course",
        cell: ({ row }) => (
            <div>
                <div>{row.getValue("courseCode")}: {row.original.courseTitle}</div>
            </div>
        ),
    },
    {
        accessorKey: "dateMarked",
        header: () => {
            return(
            <div className="ml-2">Date Marked</div>
            );
        }
    },
    {
        accessorKey: "markedBy",
        header: "Marked By",
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Attendance Status
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="ml-8">{row.getValue("status")}</div>,
    },
]
export default function MarkAttendance({ courses, attendances }: { courses: CourseDropdownModel[], attendances: IAttendance[] }) {
    const [data, setAttendance] = useState<IAttendance[]>(attendances)
    const dateString = getTodaysDate()
    const [date, setDate] = React.useState<Date | undefined>(new Date())


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // States
    const [rollNo, setRollNo] = React.useState<string>("")
    const [courseId, setCourseId] = React.useState<string>("")

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
    })

    return (
        <div className="pe-4 ps-8">
            <div className="flex flex-row justify-between w-full  gap-4">
                <div>
                    <h2 className="scroll-m-20 text-2xl font-extrabold italic tracking-tight text-muted-foreground lg:text-md">{dateString}</h2>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-4 items-end">
                        <Select
                        onValueChange={(value) => setCourseId(value)}
                        >
                            <SelectTrigger className="w-[450px]">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((c) => (
                                    <SelectItem key={c.courseId} value={c.courseId.toString()}
                                    >
                                        {c.courseCode} - {c.courseName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input className="w-[450px]" placeholder="Enter comma separated roll numbers"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        />
                        <Button> Mark Attendance</Button>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by university roll number"
                        value={(table.getColumn("universityRollNo")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("universityRollNo")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="ml-auto">
                        <SmartSelect
                            items={
                                table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column: Column<IAttendance>) => {
                                        return {
                                            key: column.id,
                                            label: column.id,
                                            isChecked: column.getIsVisible()
                                        }
                                    })}
                            onCheckedChange={(item, value) =>
                                table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide()).find(column => column.id == item.key)?.toggleVisibility(!!value)
                            }
                            title="Columns"
                            variant={'outline'}
                            key={'id'}
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
                                        )
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
            </div>
        </div>
    )
}

function getTodaysDate() {
    const date = new Date();

    // Array of month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Function to get the suffix (st, nd, rd, th)
    const getDaySuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th are exceptions
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    // Get the day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Return the formatted date
    return `${month} ${day}${getDaySuffix(day)} — ${year}`;
}

