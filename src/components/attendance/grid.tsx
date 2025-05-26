"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
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

import { ATTENDANCE_STATUS, AttendanceResponse, CourseDropdownModel, IAttendance } from '@/app/models/attendance'
import { SmartSelect } from "@/components/re-useables"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import MarkAttendance from './form'
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

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
            return (
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
export default function AttendanceGrid({ courses, attendances, token }: { courses: CourseDropdownModel[], attendances: IAttendance[], token: string }) {
    const [data, setAttendance] = useState<IAttendance[]>(attendances);
    const dateString = getTodaysDate();
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const handleDate = (date: Date | undefined) => {
        if (date) {
            setDate(date);
            fetchAttendanceByDate(date);
        }
    };

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            fetchAttendanceByDateRange(range.from, range.to);
        }
    };

    const fetchAttendanceByDate = (date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAttendanceByDate/${formattedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error("Failed to fetch attendance by date");
            })
            .then((data: IAttendance[]) => {
                updateAttendanceData(data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    const fetchAttendanceByDateRange = (startDate: Date, endDate: Date) => {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAttendanceByDateRange?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error("Failed to fetch attendance by date range");
            })
            .then((data: IAttendance[]) => {
                updateAttendanceData(data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    };

    const updateAttendanceData = (data: IAttendance[]) => {
        const updatedData = data.map((a) => {
            a.dateMarked = new Date(a.dateMarked).toLocaleString();
            a.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(a.status))?.Status || a.status;
            return a;
        });
        setAttendance(updatedData);
    };

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

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
    const markedAttendance = (response: AttendanceResponse) => {
        if (response.invalidRollNumbers?.length) {
            if (response.message !== undefined) {
                toast.success(response.message);
            }
            toast.warning(`Invalid Student Roll Nos: ${response.invalidRollNumbers}`);
        }
        else {
            toast.success(response.message);
        }

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAllAttendance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    throw new Error("Failed to fetch attendances");
            })
            .then((data: IAttendance[]) => {
                data = data.map((a) => {
                    a.dateMarked = new Date(a.dateMarked).toLocaleString();
                    a.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(a.status))?.Status || a.status;
                    return a;
                });
                setAttendance(data);
            })
    }

    return (
        <div className="pe-4 ps-8">
            <div className="flex flex-row justify-between w-full gap-4">
                <div>
                    <h2 className="scroll-m-20 text-2xl font-extrabold italic tracking-tight text-muted-foreground lg:text-md">{dateString}</h2>
                </div>
                <div className="flex flex-row gap-4">
                    <MarkAttendance courses={courses} handleMarkAttend={markedAttendance} token={token}></MarkAttendance>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDate}
                        className="rounded-md border"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                {dateRange?.from
                                    ? `${format(dateRange.from, "MMM dd, yyyy")} - ${dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Select"}`
                                    : "Select Date Range"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={handleDateRangeChange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
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

