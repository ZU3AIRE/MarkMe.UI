
import { DEFAULT_COURSE } from "@/app/models/course";
import { CourseForm } from "@/components/courses/form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New - Course"
};
export default function RegisterCourse() {

  return (
    <CourseForm formData={DEFAULT_COURSE} />
  );
}

