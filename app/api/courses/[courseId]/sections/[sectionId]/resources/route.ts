import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const POST = (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
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
    const { name, fileUrl } = await req.json();

    const resource = await db.resource.create({
      data: {
        name,
        fileUrl,
        sectionId,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.log('RESOURCE_POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
