import { Course } from "@/app/models/course";
import { Metadata } from "next";
import { CourseForm } from "../../../../components/courses/form";

export const metadata: Metadata = {
  title: "Update - Course"
};

export default async function UpdateCoursePage({ params }: { params: Promise<{ key: number }> }) {
  const key = (await params).key;
  const courses: Course[] = [
    { id: 1, courseCode: 'IT101', title: 'Introduction to Programming', teacher: 'John Doe', creditHours: 48, creditHoursPerWeek: 3, semester: 4, courseType: "1" },
    { id: 2, courseCode: 'WD202', title: 'Web Development', teacher: 'Jane Smith', creditHours: 62, creditHoursPerWeek: 4, semester: 6, courseType: "0" },
    { id: 3, courseCode: 'DS303', title: 'Data Structures', teacher: 'Bob Wilson', creditHours: 50, creditHoursPerWeek: 2, semester: 7, courseType: "1" },
  ];

  // Load Course from backend
  const course = await new Promise<Course>(resolve => setTimeout(() => { resolve(courses.find(x => x.id == key)!) }, 4000));

  return (
    <CourseForm formData={{ ...course }} />
  );
}