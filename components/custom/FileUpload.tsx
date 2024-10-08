'use client';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  page: string;
}

const FileUpload = ({ value, onChange, endpoint, page }: FileUploadProps) => {
  console.log(endpoint)
  return (
    <div className="flex flex-col gap-2">
      {page === 'Edit Course' && value !== '' && (
        <>
          <p className="text-sm font-medium">{value}</p>
          <Image
            src={value}
            alt="image"
            width={500}
            height={500}
            className="w-[280px] h-[200px] object-cover rounded-xl"
          />
        </>
      )}
      {page === 'Edit Section' && value !== '' && (
        <p className="text-sm font-medium">{value}</p>
      )}

      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res?.url) {
            onChange(res?.url);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
        className="w-[280px] h-[200px]"
      />
    </div>
  );
};

export default FileUpload;
