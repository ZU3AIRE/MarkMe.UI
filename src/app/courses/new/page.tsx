import { Metadata } from "next";
import CourseForm from "../../../components/courses/form";
import { DEFAULT_COURSE } from "@/app/models/course";

export const metadata: Metadata = {
  title: "New - Course"
};
export default function RegisterCourse() {
  const defaultValue = { ...DEFAULT_COURSE };
  return (
    <CourseForm defaultValue={defaultValue} mode={'create'} />
  );
}

