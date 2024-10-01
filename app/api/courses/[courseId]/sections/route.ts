import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId } }
) => {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse('Course Not Found', { status: 404 });
    }

    const lastSection = await db.section.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 0;

    const newSection = await db.section.create({
      data: {
        courseId: params.courseId,
        title,
        position: newPosition,
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.log('[SECTION_POST]', error);
    return new NextResponse('An error occurred', { status: 500 });
  }
};
