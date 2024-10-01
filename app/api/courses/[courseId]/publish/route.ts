import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const POST = (
  req: NextRequest,
  {
    params,
  }: {
    params: { courseId: string };
  }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
      include: {
        sections: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course Not Found', { status: 404 });
    }

    const isPublishedSection = course.sections.some(
      (section) => section.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.subCategoryId ||
      !course.imageUrl ||
      !course.levelId ||
      !course.price ||
      !isPublishedSection
    ) {
      return new NextResponse('Missing required fields', { status: 500 });
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId, instructorId: userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (error) {
    console.log('COURSE_PUBLISH_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
