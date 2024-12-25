export interface ICourse {
  id: number;
  title: string;
  teacher: string;
  courseCode: string;
}

export class Course implements ICourse {
  id: number = 0;
  title: string;
  teacher: string;
  courseCode: string;

  constructor(title: string, courseCode: string, teacher: string) {
    this.id = new Date().getTime();
    this.title = title;
    this.courseCode = courseCode;
    this.teacher = teacher;
  }
}
