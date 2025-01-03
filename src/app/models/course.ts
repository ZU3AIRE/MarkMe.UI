export type Course = {
  courseId: number;
  code?: string | null;
  title?: string | null;
  type: "0" | "1";
  semester: number;
  creditHours: number;
  creditHoursPerWeek: number;
  isArchived: boolean;
  assignedTo: number;
  teacherId: string;
};

export const DEFAULT_COURSE: Course = {
  courseId: 0,
  code: '',
  title: '',
  type: '0',
  semester: 1,
  creditHours: 3,
  creditHoursPerWeek: 3,
  isArchived: false,
  assignedTo: 0,
  teacherId: "1"
};

export const Course = {
  types: {
    MINOR: '0',
    MAJOR: '1'
  } as const
};


// API Models
export type CreateCourseModel = {
  title: string;
  code: string;
  type: number;
  semester: number;
  creditHours: number;
  creditHoursPerWeek: number;
};

export type CourseModel = {
  courseId: number;
  title: string;
  code: string;
  type: "0" | "1";
  semester: number;
  creditHours: number;
  creditHoursPerWeek: number;
};