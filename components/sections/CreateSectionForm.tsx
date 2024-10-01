'use client';

import { Course, Section } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import SectionList from './SectionList';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least two characters',
  }),
});
const CreateSectionForm = ({
  course,
}: {
  course: Course & { section: Section[] };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const routes = [
    {
      label: 'Basic Information',
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: 'Curriculum', path: `/instructor/courses/${course.id}/sections` },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${course.id}/sections`,
        values
      );

      if (res.status === 201) {
        toast.success('New Section created successfully');
        router.push(`/instructor/courses/${course.id}/sections/${res.data.id}`);
      } else {
        toast.error('Failed to create section');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log('Failed to create section', error);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${course.id}/sections/reorder`, {
        list: updateData,
      });

      toast.success('Reordered successfully');
    } catch (error) {
      console.log('Failed to reorder', error);
      toast.error('Failed to reorder');
    }
  }

  return (
    <div className="p-10">
      <div className="flex gap-5">
        {routes.map((route) => (
          <Link key={route.label} href={route.path} className="flex gap-4">
            <Button variant={pathname === route.path ? 'default' : 'outline'}>
              {route.label}
            </Button>
          </Link>
        ))}
      </div>

      <SectionList
        items={course.sections || []}
        onReorder={onReorder}
        onEdit={(id) => router.push(`/instructor/courses/${course.id}/sections/${id}`)}
      />

      <h1 className="text-xl font-bold mt-5">Add new Section</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Introduction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <Link href={`/instructor/courses/${course.id}/basic`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CreateSectionForm;
