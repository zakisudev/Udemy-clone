import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const POST = (
  req: NextRequest,
  {
    params,
  }: {
    params: { courseId: string; sectionId: string };
  }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse('Course Not Found', { status: 404 });
    }

    const unpublishedSection = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    const publishedSectionInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedSectionInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
          instructorId: userId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedSection, { status: 200 });
  } catch (error) {
    console.log('SECTION_UNPUBLISH_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
