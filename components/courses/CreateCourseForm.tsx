'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ComboBox } from '../custom/ComboBox';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters long',
    })
    .max(50, {
      message: 'Title must be at most 50 characters long',
    }),
  categoryId: z.string().min(1, {
    message: 'Category must be selected',
  }),
  subCategoryId: z.string().min(1, {
    message: 'Subcategory must be selected',
  }),
});

type CreateCourseFormProps = {
  categories: {
    id: string;
    name: string;
    subcategories: { label: string; value: string }[];
  }[];
};

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      subCategoryId: '',
    },
  });

  const { isValid, isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post('/api/courses', values);

      console.log(res);
      if (res.status === 201) {
        router.push(`/instructor/courses/${res.data.id}/basic`);
        toast.success('Course created successfully');
      } else {
        console.error('Failed to create new course');
        toast.error('Failed to create new course');
      }
    } catch (error) {
      console.error("Failed to create new course");
      toast.error('Failed to create new course');
    }
  }

  return (
    <div className="p-10">
      <h1 className="font-bold text-xl">
        Let&apos;s give some basic detail for your course
      </h1>
      <p className="text-sm mt-3 text-gray-500">
        It&apos;s ok if you can&apos;t think of a good title or correct category
        now, you can always change it later.
      </p>

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

          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
