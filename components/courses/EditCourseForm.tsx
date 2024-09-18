'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Course } from '@prisma/client';
import { Trash } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ComboBox } from '../custom/ComboBox';
import RichEditor from '../custom/RichEditor';
import FileUpload from '../custom/FileUpload';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters long',
    })
    .max(50, {
      message: 'Title must be at most 50 characters long',
    }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  categoryId: z.string().min(1, {
    message: 'Category is required',
  }),
  subCategoryId: z.string().min(1, {
    message: 'Subcategory is required',
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
});

type EditCourseFormProps = {
  course: Course;
  categories: {
    id: string;
    name: string;
    subcategories: { label: string; value: string }[];
  }[];
  levels: {
    value: string;
    label: string;
  }[];
};

const EditCourseForm = ({
  course,
  categories,
  levels,
}: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle || '',
      description: course.description || '',
      price: course.price || 0,
      categoryId: course.categoryId,
      subCategoryId: course.subCategoryId,
      levelId: course.levelId || '',
      imageUrl: course.imageUrl || '',
    },
  });

  const routes = [
    {
      label: 'Basic Information',
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: 'Curriculum', path: `/instructor/courses/${course.id}/sections` },
  ];

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch(`/api/courses/${course.id}`, values);

      if (res.status === 200) {
        router.push(`/instructor/courses/${res.data.id}/basic`);
        toast.success('Course updated');
        router.refresh();
      } else {
        console.error('Failed to update course');
        toast.error('Failed to update course');
      }
    } catch (error) {
      console.error('Something went wrong');
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-10">
      <div className="flex gap-2 flex-col sm:flex-row sm:justify-between">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.label} href={route.path} className="flex gap-4">
              <Button variant={pathname === route.path ? 'default' : 'outline'}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <Button variant="outline">Publish</Button>
          <Button>
            <Trash className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. Web Development for Beginners"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. Become a fullstack developer with just 1 course"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="What is this course about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-evenly flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <ComboBox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sub category</FormLabel>
                  <FormControl>
                    <ComboBox
                      options={
                        categories?.find(
                          (cat) => cat.value === form.watch('categoryId')
                        )?.subCategories || []
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Course Banner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ''}
                    onChange={(url) => field.onChange(url.url)}
                    endpoint="courseBanner"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-gray-400">(USD)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCourseForm;
