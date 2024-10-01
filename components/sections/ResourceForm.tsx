'use client';

import { Section, Resource } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PlusCircle, X, File, Loader2 } from 'lucide-react';

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
import FileUpload from '@/components/custom/FileUpload';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least two characters',
  }),
  fileUrl: z.string().min(1, {
    message: 'File is requires',
  }),
});

type ResourceFormProps = {
  section: Section & { resources: Resource[] };
  CourseId: string;
};

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      fileUrl: '',
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        values
      );

      if (res.status === 201) {
        toast.success('New Resource added successfully');
        form.reset();
        router.refresh();
      } else {
        toast.error('Failed to add resource');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log('Failed to add resource', error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
      );

      if (res.status === 200) {
        toast.success('Resource deleted successfully');
        form.reset();
        router.refresh();
      } else {
        toast.error('Failed to delete resource');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log('Failed to delete resource', error);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center text-xl font-bold mt-12">
        <PlusCircle size={24} />
        Add Resources (optional)
      </div>
      <p className="text-sm font-medium mt-2">
        Add resources to this section to help your students learn better
      </p>

      <div className="mt-5 flex flex-col gap-5">
        {section?.resources?.map((resource, index) => (
          <div
            key={index}
            className="flex justify-between bg-[#fff8eb] rounded-lg text-sm font-medium p-3"
          >
            <div className="flex items-center">
              <File className="h-4 w-4 mr-4" />
              {resource.name}
            </div>
            <button
              className="flex text-[#fdab04]"
              disabled={isSubmitting}
              onClick={() => onDelete(resource.id)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Textbook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Upload file</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || ''}
                      onChange={(url) => field.onChange(url.url)}
                      endpoint="sectionResource"
                      page="Edit Section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4" animate-spin />
              ) : (
                'Upload'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
export default ResourceForm;
