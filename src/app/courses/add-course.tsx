import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ICourse, Course } from "../models/course";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Course title must be at least 2 characters long.",
  }),
  courseCode: z.string().min(3, {
    message: "Course code must be at least 3 characters long.",
  }),
  teacher: z.string().min(4, {
    message: "A valid professor name must be defined.",
  }),
});

export const defaultValues = {
  title: "",
  teacher: "",
  courseCode: "",
}

export function RegisterCourse({ onSave }: { onSave: (courseAdded: ICourse) => void }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(course: { title: string; teacher: string; courseCode: string; }) {
    const data: ICourse[] =
      JSON.parse(window.localStorage.getItem("courses") || "[]") || [];
    const newCourse = new Course(course.title, course.courseCode, course.teacher);
    data.push(newCourse);
    window.localStorage.setItem("courses", JSON.stringify(data));
    onSave(course as unknown as ICourse);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input
                  type="title"
                  placeholder="Lorem Ipsum"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Complete name of the course without course code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="AB-123" {...field} />
              </FormControl>
              <FormDescription>The course code for the course.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor Assigned</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                The professor who will be teaching the course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
