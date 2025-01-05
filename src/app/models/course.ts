export type Course = {
  courseId: number;
  code: string;
  title: string;
  type: CourseType;
  semester: number;
  creditHours: number;
  creditHoursPerWeek: number;
  isArchived: boolean;
  assignedTo: number;
};

export const DEFAULT_COURSE: Course = {
  courseId: 0,
  code: '',
  title: '',
  type: 0,
  semester: 1,
  creditHours: 3,
  creditHoursPerWeek: 3,
  isArchived: false,
  assignedTo: 0,
};

export enum CourseType {
    MINOR,
    MAJOR
};

// API Models
export type CourseModel = Pick<Course, 'courseId' | 'code' | 'title' | 'type' | 'semester' | 'creditHours' | 'creditHoursPerWeek'>;