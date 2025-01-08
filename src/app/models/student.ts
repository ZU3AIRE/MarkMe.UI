export interface IStudent {
    studentId: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;
}
export class Student implements IStudent {
    studentId: number;
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
        this.studentId = Math.floor(Math.random() * 1000);
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
    studentId: 0,
    firstName: "",
    lastName: "",
    collegeRollNo: "",
    universityRollNo: "",
    registrationNo: "",
    session: "",
    section: "",
};