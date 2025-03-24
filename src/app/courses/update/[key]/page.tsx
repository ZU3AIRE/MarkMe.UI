import { CourseModel, DEFAULT_COURSE } from "@/app/models/course";
import CourseForm from "@/components/courses/form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update - Course"
};

export default async function UpdateCoursePage({ params }: { params: Promise<{ key: number }> }) {
  const key = (await params).key;
  let data: CourseModel = { ...DEFAULT_COURSE };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Course/GetCourseById/${key}`);
    if (res.ok) data = await res.json();
    else throw new Error("Failed to fetch course");
  }
  catch (err) {
    console.error("❌ ", err);
  }

  return (
    <CourseForm defaultValue={data} mode={'update'} />
  );
}