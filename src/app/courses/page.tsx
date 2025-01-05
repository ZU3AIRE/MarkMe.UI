import CourseGrid from "../../components/courses/grid";
import { CourseModel } from "../models/course";

export default async function Courses() {
  let data: CourseModel[] = [];

  try {
    const res = await fetch('https://localhost:7177/api/Course/GetAllCourses');
    if(res.ok) data = await res.json();
    else throw new Error("Failed to fetch courses");
  }
  catch (err) {
    console.error("Failed to fetch courses", err);
  }

  return (
    <CourseGrid courses={data} />
  );
}