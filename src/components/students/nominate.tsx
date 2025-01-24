"use client"
import AddUpdateForm, { FormData } from "@/components/class-representatives/form";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui";

export default function NominateCR({ onSuccess: _onSuccess, token, open, setOpen, studentId }: { onSuccess: () => void, token: string, open: boolean, setOpen: (open: boolean) => void, studentId: number }) {
    const defaultValues: FormData = { studentId: studentId, courseIds: [0] }

    const onSuccess = () => {
        setOpen(false);
        _onSuccess();
    }

    return (
        <>
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

