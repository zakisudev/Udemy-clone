'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
type PublishButtonProps = {
  disabled: boolean;
  courseId: string;
  sectionId?: string;
  isPublished: boolean;
  page: string;
};

const PublishButton = ({
  disabled,
  courseId,
  sectionId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/api/courses/${courseId}`;
    if (page === 'Section') {
      url += `/section/${sectionId}`;
    }

    try {
      setIsLoading(true);
      isPublished
        ? await axios.post(`${url}/unpublish`)
        : await axios.post(`${url}/publish`);

      toast.success(`${page} ${isPublished ? 'unpublished' : 'published'}`);
      router.refresh();
    } catch (error) {
      toast.error('Something Went Wrong');
      console.log(`Failed to ${isPublished ? 'unpublish' : 'publish'} ${page}`);
    } finally {
      setIIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 classNName="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        'Unpublish'
      ) : (
        'Publish'
      )}
    </Button>
  );
};
export default PublishButton;
