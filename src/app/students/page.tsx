'use client'
import ActionButton, { Actions } from "@/components/re-useables/ActionButton/Page"
import SmartSelect from "@/components/re-useables/SmartSelect/page"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Column, ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { IStudent, Students } from "../models/student"
import { RegisterStudent } from "./add-student"
import { UpdateStudent } from "./update-student"

export default function StudentsComp() {
    useEffect(() => loadStudents(), []);

    // Initialize datasource
    const loadStudents = () => {
        const students =
            JSON.parse(window.localStorage.getItem("students") || "[]") || [];
        setDataSource(students);
    };

    // Table Setup
    const [dataSource, setDataSource] = useState<IStudent[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

    // Modal Open State Variables
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
    const [studentBeingUpdated, setStudentBeingUpdated] = React.useState<Students>({ id: 0, name: "", collegeRollNo: 0, universityRollNo: 0, session: "", currentSemester: "", attendance: "", email: "", phoneNumber: "" });

    const columns: ColumnDef<IStudent>[] = [
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
            accessorKey: "collegeRollNo",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        College Roll No
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-7 lowercase">{row.getValue("collegeRollNo")}</div>,
        },
        {
            accessorKey: "universityRollNo",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        University Roll No
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-7 lowercase">{row.getValue("universityRollNo")}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "session",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Session
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-4 lowercase">{row.getValue("session")}</div>,
        },
        {
            accessorKey: "currentSemester",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Current Semester
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-11 lowercase">{row.getValue("currentSemester")}</div>,
        },
        {
            accessorKey: "attendance",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Attendence
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-11 lowercase">{row.getValue("attendance")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone Number",
            cell: ({ row }) => {
                return <div>{row.getValue("phoneNumber")}</div>
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const student = row.original;
                const tableActions: Actions[] = [
                    {
                        key: "copy",
                        label: <>Copy Student Id</>,
                        onClick: () => {
                            navigator.clipboard.writeText(student.id.toString());
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
                            setStudentBeingUpdated(student);
                            setIsUpdateModalOpen(true);
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
                        },
                    },
                ];
                return (
                    <ActionButton items={tableActions} ></ActionButton>
                );
            },
        },
    ]

    const table = useReactTable({
        data: dataSource,
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

    const onStudentAdded = (newStudent: IStudent) => {
        setDataSource([...dataSource, newStudent]);
        setIsAddModalOpen(false);
        toast.success(
            `${newStudent.name} is added successfully!`
        );
    };

    const onStudentUpdated = (updatedStudent: IStudent | null) => {
        if (!updatedStudent) {
            toast.error("Something went wronge! Please try again.");
        } else {
            const updatedStudents = dataSource.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
            );
            setDataSource(updatedStudents);
            toast.success(
                `${updatedStudent.name} is updated successfully`
            );
        }
        setIsUpdateModalOpen(false);
    };
    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold">Students</h1>
                    <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                        Add student
                    </Button>
                </div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="ml-auto">
                        <SmartSelect
                            items={
                                table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column: Column<IStudent>) => {
                                        return {
                                            key: column.id,
                                            label: column.id,
                                            isChecked: column.getIsVisible()
                                        }
                                    })}
                            onCheckedChange={(item, checked) =>
                                table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide()).find((column) => column.id === item.key)?.toggleVisibility(!!checked)
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
            {/* Add Student Dialog */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="lg:max-w-[40vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Add Student</DialogTitle>
                        <DialogDescription>
                            Add student. Click submit when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <RegisterStudent onSave={onStudentAdded} />
                </DialogContent>
            </Dialog>

            {/* Update Student Dialog */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="lg:max-w-[40vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Update Student</DialogTitle>
                        <DialogDescription>
                            Update student. Click submit when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateStudent student={studentBeingUpdated} onSave={onStudentUpdated} />
                </DialogContent>
            </Dialog>
        </>

    )
}