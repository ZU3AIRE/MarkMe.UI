import { SelectListItem } from "./common";

export type Activity = {
    description: string;
    date: Date;
};

export type CRModel = {
    studentId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    courses: SelectListItem[];
    activities: Activity[];
    avatar: string;
};