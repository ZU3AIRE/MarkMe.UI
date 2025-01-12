"use client"

import { SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { DEFAULT_STUDENT } from '../../app/models/student';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui";
import AddUpdateForm, { FormData } from "./form";

type UpdateCrProps = {
    student: {
        firstName: string,
        lastName: string,
        studentId: number
    },
    courseIds: number[],
    onSuccess: () => void
}

export default function UpdateCr({ student, courseIds, onSuccess: _onSuccess }: UpdateCrProps) {
    const [open, setOpen] = useState(false);

    const onSuccess = () => {
        setOpen(false);
        _onSuccess();
    }

    const defaultValues: FormData = { studentId: student.studentId, courseIds: courseIds }
    return (
        <>
            <Button variant={'outline'} size="icon" onClick={() => { setOpen(true) }}><SquareArrowOutUpRight /></Button>
            <Dialog open={open} onOpenChange={(_open) => setOpen(_open)}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader >
                        <DialogTitle>Nomiate Class Representative</DialogTitle>
                        <DialogDescription>
                            Select the course you wish to nominate a class representative for.
                        </DialogDescription>
                    </DialogHeader>
                    <AddUpdateForm onSuccess={onSuccess} defaultValues={defaultValues} mode={"update"} updateNominee={{ ...DEFAULT_STUDENT, firstName: student.firstName, lastName: student.lastName, studentId: student.studentId }}>
                        <footer className="space-x-4 text-end">
                            <Button variant="outline" onClick={() => setOpen(false)} type="button">Cancel</Button>
                            <Button type="submit">Update</Button>
                        </footer>
                    </AddUpdateForm>
                </DialogContent>
            </Dialog>
        </>
    );
}

