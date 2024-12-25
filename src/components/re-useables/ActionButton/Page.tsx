import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { MouseEventHandler, ReactNode } from "react";
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export interface Actions {
    label: ReactNode;
    key: string;
    variant?: string;
    onClick: MouseEventHandler<HTMLDivElement>
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
                            } else {
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

export default ActionButton;
