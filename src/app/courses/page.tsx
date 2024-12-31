import { Course } from "../models/course";
import CourseGrid from "../../components/courses/grid";

export default async function Courses() {
  async function getCourses() {
    const courses: Course[] = [
      { id: 1, courseCode: 'IT-101', title: 'Introduction to Programming', teacher: 'John Doe', creditHours: 48, creditHoursPerWeek: 3, semester: 4, courseType: "1" },
      { id: 2, courseCode: 'WD-202', title: 'Web Development', teacher: 'Jane Smith', creditHours: 62, creditHoursPerWeek: 4, semester: 6, courseType: "0" },
      { id: 3, courseCode: 'DS-303', title: 'Data Structures', teacher: 'Bob Wilson', creditHours: 50, creditHoursPerWeek: 2, semester: 7, courseType: "1" },
    ];

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    return courses;
  }

  const courses = await getCourses();

  return (
    <CourseGrid courses={courses} />
  );
}