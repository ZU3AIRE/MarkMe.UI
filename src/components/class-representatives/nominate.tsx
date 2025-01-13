"use client"

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui";
import AddUpdateForm, { FormData } from "./form";

export default function Nominate({ onSuccess: _onSuccess, token }: { onSuccess: () => void, token: string }) {
    const [open, setOpen] = useState(false);
    const defaultValues: FormData = { studentId: 0, courseIds: [0] }

    const onSuccess = () => {
        setOpen(false);
        _onSuccess();
    }

    return (
        <>
            <Button onClick={() => { setOpen(true) }} ><PlusIcon /> Nominate</Button>
            <Dialog open={open} onOpenChange={(_open) => setOpen(_open)}>
                <DialogContent className="lg:max-w-[30vw] max-h-[65vh] overflow-y-auto p-6 rounded-lg shadow-lg">
                    <DialogHeader >
                        <DialogTitle>Nomiate Class Representative</DialogTitle>
                        <DialogDescription>
                            Select the course you wish to nominate a class representative for.
                        </DialogDescription>
                    </DialogHeader>
                    <AddUpdateForm defaultValues={defaultValues} mode={"add"} updateNominee={undefined} onSuccess={onSuccess} token={token}>
                        <footer className="space-x-4 text-end">
                            <Button variant="outline" onClick={() => setOpen(false)} type="button">Cancel</Button>
                            <Button type="submit">Nominate</Button>
                        </footer>
                    </AddUpdateForm>
                </DialogContent>
            </Dialog>
        </>
    );
}

