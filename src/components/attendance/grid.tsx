"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
import { format } from "date-fns"
import { ArrowUpDown, CircleXIcon, SquarePen, Trash2 } from "lucide-react"
import React, { useState } from "react"

import { ATTENDANCE_STATUS, AttendanceResponse, CourseDropdownModel, IAttendance } from '@/app/models/attendance'
import { ActionButton, Actions, SmartSelect } from "@/components/re-useables"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { redirect } from "next/navigation"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import MarkAttendance from './form'

export default function AttendanceGrid({ courses, attendances, token }: { courses: CourseDropdownModel[], attendances: IAttendance[], token: string }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [data, setAttendance] = useState<IAttendance[]>(attendances);
    const dateString = getTodaysDate();
    // Model open for deletion
    const [selectedForDeletion, setSelectedForDeletion] = useState<IAttendance | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Bulk Deletion
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && !range?.to) {
            // Only one date selected, filter for that date
            const formattedDate = format(range.from, "yyyy-MM-dd");
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAttendanceByDate/${formattedDate}`,
                {
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
        } else if (range?.from && range?.to) {
            fetchAttendanceByDateRange(range.from, range.to);
        }
    };

    // Reset filters and fetch all attendance
    const handleResetFilters = () => {
        setDateRange({ from: undefined, to: undefined });
        table.setGlobalFilter("");
        fetchAllAttendance();
    };

    const updateAttendanceData = (data: IAttendance[]) => {
        const updatedData = data.map((a) => {
            a.dateMarked = new Date(a.dateMarked).toLocaleString();
            a.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(a.status))?.Status || a.status;
            return a;
        });
        setAttendance(updatedData);
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
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const attendance = row.original;
                const tableActions: Actions[] = [
                    {
                        key: "copy",
                        label: <>Copy Roll No</>,
                        onClick: () => {
                            navigator.clipboard.writeText(attendance.collegeRollNo.toString());
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
                            redirect(`/attendance/update/${attendance.attendanceId}`);
                        },
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
                            if (!attendance) { toast.error("Unable to select for deletion"); return; };
                            setSelectedForDeletion(attendance);
                            setIsDeleteModalOpen(true);
                        },
                    },
                ];
                return (
                    <>
                        <ActionButton items={tableActions} ></ActionButton>
                    </>
                );
            },
        },
    ]
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

    // Centralized fetch all attendance method
    const fetchAllAttendance = React.useCallback(() => {
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
                const updatedData = data.map((a) => {
                    a.dateMarked = new Date(a.dateMarked).toLocaleString();
                    a.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(a.status))?.Status || a.status;
                    return a;
                });
                setAttendance(updatedData);
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, [token]);

    const handleBulkDelete = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (!selectedRows.length) return;
        const AttendanceIds = selectedRows.map(row => row.original.attendanceId);
        setIsDeleting(true);
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/BulkDeleteAttendance`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ AttendanceIds }),
            })
            .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while deleting the attendance.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .then((data: IAttendance | null) => {
                if (!data) return;
                toast.warning(`Selected attendances deleted successfully!`);
                table.resetRowSelection();
                setIsDeleting(false);
                setShowDeleteDialog(false);
                fetchAllAttendance();
            })
            .catch((error: Error) => {
                toast.error("An error occurred while deleting the attendance.");
                setIsDeleting(false);
                setShowDeleteDialog(false);
                console.log('🐛 ', error);
            });
    };

    // Single Delete Handler
    const onAttendanceDeleted = (attendance: IAttendance) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/DeleteAttendance/${attendance.attendanceId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while deleting the attendance.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .then((data: IAttendance | null) => {
                if (!data) return;
                toast.warning(`Attendance of ${attendance.collegeRollNo} deleted successfully!`);
                setIsDeleteModalOpen(false);
                fetchAllAttendance();
            })
            .catch((error: Error) => {
                toast.error("An error occurred while deleting the attendance.");
                setIsDeleteModalOpen(false);
                console.log('🐛 ', error);
            });
    }

    return (
        <div className="pe-4 ps-8">
            <div className="flex flex-row justify-between w-full gap-4">
                <div>
                    <h2 className="scroll-m-20 text-2xl font-extrabold italic tracking-tight text-muted-foreground lg:text-md">{dateString}</h2>
                </div>
                <div className="flex flex-row gap-4">
                    <MarkAttendance courses={courses} handleMarkAttend={markedAttendance} token={token}></MarkAttendance>
                </div>
            </div>
            <div>
                <div className="flex items-center py-4 gap-2">
                    <Input
                        placeholder="Search..."
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="max-w-sm"
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
                    {/* Reset Button: Only show if filters are active */}
                    {((dateRange?.from || dateRange?.to) || (table.getState().globalFilter && (table.getState().globalFilter as string).length > 0)) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            onClick={handleResetFilters}
                        >
                            Reset Filters
                        </Button>
                    )}
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
                    {/* Bulk Delete Button */}
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2 flex items-center gap-1"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "Deleting..." : "Delete Selected"}
                        </Button>
                    )}
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
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Attendance Records</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the selected attendance record(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            <CircleXIcon />
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                            <Trash2 />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete</DialogTitle>
                        <DialogDescription>
                            <span className="mt-3 mb-3 border-l-2 pl-3 italic">
                                <span className="font-semibold">
                                    {selectedForDeletion?.collegeRollNo}: {selectedForDeletion?.name}?
                                </span>
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <footer className="text-end h-8">
                        <Button onClick={() => setIsDeleteModalOpen(false)}>
                            <CircleXIcon />
                            Cancel
                        </Button>{" "}
                        <Button onClick={() => { if (selectedForDeletion) onAttendanceDeleted(selectedForDeletion) }} variant="destructive">
                            <Trash2 />
                            Delete
                        </Button>
                    </footer>
                </DialogContent>
            </Dialog>
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

