export interface IStudent {
    id: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;
}
export class Student implements IStudent {
    id: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;

    constructor(
        collegeRollNo: string,
        universityRollNo: string,
        registrationNo: string,
        firstName: string,
        lastName: string,
        session: string,
        section: string,
    ) {
        this.id = Math.floor(Math.random() * 1000);
        this.collegeRollNo = collegeRollNo;
        this.universityRollNo = universityRollNo;
        this.registrationNo = registrationNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.session = session;
        this.section = section;
    }
}

export const DEFAULT_STUDENT: Student = {
    id: 0,
    firstName: "",
    lastName: "",
    collegeRollNo: "",
    universityRollNo: "",
    registrationNo: "",
    session: "",
    section: ""
};