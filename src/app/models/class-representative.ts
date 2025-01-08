export type Activity = {
    description: string;
    date: Date;
};

export type CRModel = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    courses: string[];
    activities: Activity[];
    avatar: string;
};