'use client'
import { DEFAULT_STUDENT, Student } from "@/app/models/student"
import { ActionButton, Actions, SmartSelect } from "@/components/re-useables"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Column, ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, CircleXIcon, PlusIcon, SquarePen, Trash2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"
import NominateCR from "./nominate"

export default function StudentGrid({ students, nominees, token }: { students: Student[], nominees: Student[], token: string }) {

    // Table Setup
    const [data, setData] = useState<Student[]>(students);
    const [Nominees, setNominess] = useState<Student[]>(nominees);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

    // Modal Open State Variables
    const [isNominate, setNominamteModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [selectedForDeletion, setSelectedStudentForDeletion] = React.useState<Student>(DEFAULT_STUDENT);
    const [StudentId, setStudentId] = React.useState<number>(0);

    const columns: ColumnDef<Student>[] = [
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
            accessorKey: "firstName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        First Name
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) =>
            {
                const student = row.original;
                const isNominees = Nominees.some(s => s.studentId === student.studentId);
                return(
                    <div className="ml-7 flex items-center">
                    {isNominees ? (
                        <span>{student.firstName}</span>
                    ) : (
                        <>
                            <span>{student.firstName}</span>
                            <span className="relative flex h-2.5 w-2.5 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                        </>
                    )}
                </div>
                );
            },
        },
        {
            accessorKey: "lastName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Last Name
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-7">{row.getValue("lastName")}</div>,
        },
        {
            accessorKey: "collegeRollNo",
            header: "College Roll No",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("collegeRollNo")}</div>
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
            cell: ({ row }) => <div className="ml-4 lowercase">{row.getValue("universityRollNo")}</div>,
        },
        {
            accessorKey: "registrationNo",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Registration No
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-4 lowercase">{row.getValue("registrationNo")}</div>,
        },
        {
            accessorKey: "section",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Section
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-11 uppercase">{row.getValue("section")}</div>,
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
                            navigator.clipboard.writeText(student.studentId.toString());
                        },
                    },
                    {
                        key: "makeCR",
                        label: <>Make CR </>,
                        hidden: !Nominees.some(s => s.studentId === student.studentId),
                        onClick: () => {
                            setNominamteModalOpen(true);
                            setStudentId(student.studentId);
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
                            redirect(`/students/update/${student.studentId}`);
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
                            setSelectedStudentForDeletion(student);
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

    const onSuccess = () => {
        fetch('https://localhost:7177/api/Student/GetCRNominees')
            .then(res => {
                if (!res.ok) {
                    switch (res.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while deleting the student.");
                            break;
                    }
                }
                return res.ok ? res.json() : null;
            }).then(res => {
                res.map((std: Student) => {
                    std.registrationNo = std.registrationNo.slice(0, 4) + '-' + std.registrationNo.slice(4, 7) + '-' + std.registrationNo.slice(7, 10);
                    std.session = std.session.slice(0, 4) + '-' + std.session.slice(4, 8);
                })
                setNominess(res);
            }).
            catch(err => {
                console.error("Failed to fetch students", err);
            });
    }

    const onStudentDeleted = (student: Student) => {
        fetch(`https://localhost:7177/api/Student/DeleteStudent/${student.studentId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
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
            .then((data: Student | null) => {
                if (!data) return;

                toast.warning(`${student.firstName} deleted successfully!`);
                console.log("✅ Updated: ", data);
                setIsDeleteModalOpen(false);
                fetch('https://localhost:7177/api/Student/GetAllStudents')
                    .then(res => {
                        if (!res.ok) {
                            switch (res.status) {
                                case 400:
                                    toast.error("Invalid data was provided.");
                                    break;
                                default:
                                    toast.error("An error occurred while deleting the student.");
                                    break;
                            }
                        }
                        return res.ok ? res.json() : null;
                    }).then(res => {
                        res.map((std: Student) => {
                            std.registrationNo = std.registrationNo.slice(0, 4) + '-' + std.registrationNo.slice(4, 7) + '-' + std.registrationNo.slice(7, 10);
                            std.session = std.session.slice(0, 4) + '-' + std.session.slice(4, 8);
                        })
                        setData(res);
                    }).
                    catch(err => {
                        console.error("Failed to fetch students", err);
                    });
            })
            .catch((error: Error) => {
                toast.error("An error occurred while deleting the student.");
                console.log('🐛 ', error);
            });
    }
    return (
        <>
            <NominateCR onSuccess={onSuccess} token={token} open={isNominate} setOpen={setNominamteModalOpen} studentId={StudentId} />
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold">
                        Students
                    </h1>
                    <Link href="/students/new" >
                        <Button>
                            <PlusIcon /> Add
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter names..."
                        value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("firstName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="ml-auto">
                        <SmartSelect
                            items={
                                table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column: Column<Student>) => {
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

            {/* Delete Student Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete</DialogTitle>
                        <DialogDescription>
                            <span className="mt-3 mb-3 border-l-2 pl-3 italic">
                                <span className="font-semibold">
                                    {selectedForDeletion.firstName}: Roll No {selectedForDeletion.collegeRollNo} {`?`}
                                </span>
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <footer className="text-end h-8">
                        <Button onClick={() => setIsDeleteModalOpen(false)}>
                            <CircleXIcon />
                            Cancel
                        </Button>{" "}
                        <Button onClick={() => onStudentDeleted(selectedForDeletion)} variant="destructive">
                            <Trash2 />
                            Delete
                        </Button>
                    </footer>
                </DialogContent>
            </Dialog>
        </>

    )
}