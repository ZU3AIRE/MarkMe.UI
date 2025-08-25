
export class Student {
    studentId: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;
    email: string;

    constructor(
        collegeRollNo: string,
        universityRollNo: string,
        registrationNo: string,
        firstName: string,
        lastName: string,
        session: string,
        section: string,
        email: string
    ) {
        this.studentId = Math.floor(Math.random() * 1000);
        this.collegeRollNo = collegeRollNo;
        this.universityRollNo = universityRollNo;
        this.registrationNo = registrationNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.session = session;
        this.section = section;
        this.email = email;
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
    email: ""
};

export class StudentDropDown{
    studentId!: number;
    studentName!: string
}