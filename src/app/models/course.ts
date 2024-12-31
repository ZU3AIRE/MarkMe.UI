export type Course = {
  id: number;
  courseCode: string;
  title: string;
  courseType: "0" | "1";
  teacher: string;
  semester: number;
  creditHours: number;
  creditHoursPerWeek: number;
}

export const DEFAULT_COURSE: Course = {
  id: 0,
  courseCode: '',
  title: '',
  courseType: '0',
  teacher: '',
  semester: 1,
  creditHours: 3,
  creditHoursPerWeek: 3
};

export const Course = {
  types: {
    MINOR: '0',
    MAJOR: '1'
  } as const
};