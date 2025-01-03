import CourseGrid from "../../components/courses/grid";
import { Course, CourseModel, DEFAULT_COURSE } from "../models/course";

export default async function Courses() {
  const res = await fetch('https://localhost:7177/api/Course/GetAllCourses');
  const data: CourseModel[] = await res.json();
  const courses = data.map((x: CourseModel) : Course => ({ ...DEFAULT_COURSE, ...x }));
  console.log('\n😎', courses, '\n');
  return (
    <CourseGrid courses={courses} />
  );
}