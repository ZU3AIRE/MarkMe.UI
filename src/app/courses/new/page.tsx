
import { Course, DEFAULT_COURSE } from "@/app/models/course";
import { CourseForm } from "@/components/courses/form";
import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New - Course"
};
export default function RegisterCourse() {

  return (
      <CourseForm formData={DEFAULT_COURSE} action={onAdd} />
  );
}

export const onAdd = async (prevState: { error: string[] }, formData: FormData) => {
  "use server"
  await new Promise<Course>(resolve => setTimeout(resolve, 2000));
  redirect('/courses');
}