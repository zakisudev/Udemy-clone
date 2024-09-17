import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) return new Error('Unauthorized');

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  courseBanner: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {
      console.log('upload completed');
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
