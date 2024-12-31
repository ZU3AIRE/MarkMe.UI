import { Button } from "@/components/ui/button";
import { CheckedState } from "@radix-ui/react-checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export interface SmartSelectItem {
    label: string;
    isChecked: CheckedState;
    key: string,
}

interface SmartSelectProps {
    title: string;
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
    items: SmartSelectItem[];
    onCheckedChange: (item: SmartSelectItem, checked: boolean) => void
}


const SmartSelect = ({ title, variant, items, onCheckedChange }: SmartSelectProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant}>
                    {title}  <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items
                    .map((item) => (
                        <DropdownMenuCheckboxItem
                            key={item.key}
                            className="capitalize"
                            checked={item.isChecked}
                            onCheckedChange={(value) => onCheckedChange(item, value)}
                        >
                            {item.label}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { SmartSelect };
