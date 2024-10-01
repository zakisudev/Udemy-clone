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

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse('Section Not Found', { status: 404 });
    }

    const muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });

    if (!muxData) {
      return new NextResponse('Mux Data Not Found', { status: 404 });
    }

    if (
      !section ||
      !muxData ||
      !section.title ||
      !section.description ||
      !section.videoUrl
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const publishedSection = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedSection, { status: 200 });
  } catch (error) {
    console.log('SECTION_PUBLISH_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const DELETE = async (
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

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse('Section Not Found', { status: 404 });
    }

    if (section.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.musData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    await db.section.delete({
      where: {
        id: sectionId,
        courseId,
      },
    });

    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedSectionsInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return new NextResponse('Section Deleted', { status: 200 });
  } catch (error) {
    console.log('SECTION_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
