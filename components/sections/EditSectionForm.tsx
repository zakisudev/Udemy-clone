'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Resource, Section, MuxData } from '@prisma/client';
import { ArrowLeft } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import RichEditor from '../custom/RichEditor';
import FileUpload from '../custom/FileUpload';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import ResourceForm from './ResourceForm';
import MuxPlayer from '@mux/mux-player-react';
import Delete from '../custom/Delete';
import PublishButton from '../custom/PublishButton';

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters long',
    })
    .max(50, {
      message: 'Title must be at most 50 characters long',
    }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
});

type EditSectionFormProps = {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string;
  isCompleted: boolean;
};

const EditSectionForm = ({
  section,
  courseId,
  isCompleted,
}: EditSectionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || '',
      videoUrl: section.videoUrl || '',
      isFree: section.isFree,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );

      if (res.status === 200) {
        router.push(`/instructor/courses/${res.data.id}/basic`);
        toast.success('Section updated');
        router.refresh();
      } else {
        console.error('Failed to update section');
        toast.error('Failed to update section');
      }
    } catch (error) {
      console.error('Something went wrong');
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-10">
      <div className="flex gap-2 sm:flex-row sm:justify-between">
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button className="text-sm font-medium" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-3" />
            Back to Curriculum
          </Button>
        </Link>
        <div className="flex gap-4 items-center">
          <PublishButton
            disabled={!isCompleted}
            courseId={courseId}
            sectionId={section.id}
            isPublished={section.isPublished}
            page="Section"
          />
          <Delete item="section" courseId={courseId} sectionId={section.id} />
        </div>
      </div>

      <div className="mt-7">
        <h1 className="text-xl font-bold">Section Details</h1>
        <p className="text-sm font-medium mt-2">
          Complete this section with detailed information, good video and
          resources to give your students the best learning experience.
        </p>
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
                <FormLabel>
                  Title <span className="text-red-500"> *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. Introduction to web development"
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
                <FormLabel>
                  Description <span className="text-red-500"> *</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="What is this section about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {section.videoUrl && (
            <div className="flex my-5">
              <MuxPlayer
                playbackId={section.muxData?.playbackId || ''}
                className="md:w-[600px]"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Section Video <span className="text-red-500"> *</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ''}
                    onChange={(url) => field.onChange(url.url)}
                    endpoint="sectionVideo"
                    page="Edit Section"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Accessibility</FormLabel>
                  <FormDescription>
                    Everyone can access this for FREE
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <ResourceForm section={section} courseId={courseId} />

          <div className="flex gap-5">
            <Link href={`/instructor/courses/${courseId}/sections`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
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

export default EditSectionForm;
