import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { MouseEventHandler, ReactNode } from "react";

interface Actions {
    label: ReactNode;
    key: string;
    variant?: string;
    hidden?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>
}

interface ActionButtonProps {
    items: Actions[];
}

const ActionButton = ({ items }: ActionButtonProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {
                    items.map(
                        (item) => {
                            if (item.key === 'separator') {
                                return (<DropdownMenuSeparator key={item.key} />)
                            } else if (!item.hidden) {
                                return (<DropdownMenuItem
                                    key={item.key}
                                    onClick={item.onClick}
                                    className={(item.variant == 'destructive') ? 'text-red-500' : ''}
                                >
                                    {item.label}
                                </DropdownMenuItem>
                                )
                            }
                        }
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ActionButton };
export type { ActionButtonProps, Actions };

