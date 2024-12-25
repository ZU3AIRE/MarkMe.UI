export interface IStudent {
    id: number;
    name: string;
    email: string;
    collegeRollNo: number;
    universityRollNo: number;
    session: string;
    phoneNumber: string;
    currentSemester: string;
    attendance: string;
}

export class Students implements IStudent {
    id: number = 0;
    name: string;
    email: string;
    collegeRollNo: number;
    universityRollNo: number;
    session: string;
    phoneNumber: string;
    currentSemester: string;
    attendance: string;

    constructor(name: string , email: string, collegeRollNo: number, universityRollNo: number, session: string, phoneNumber: string, currentSemester: string, attendance: string) {
        this.id = Math.floor(Math.random() * 1000);
        this.name = name;
        this.email = email;
        this.collegeRollNo = collegeRollNo; 
        this.universityRollNo = universityRollNo; 
        this.session = session; 
        this.phoneNumber = phoneNumber; 
        this.currentSemester = currentSemester; 
        this.attendance = attendance; 
    }
}