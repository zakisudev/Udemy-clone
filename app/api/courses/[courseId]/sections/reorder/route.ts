import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../../lib/db';

export const PUT = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { list } = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
      include: {
        sections: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course Not Found', { status: 404 });
    }

    for (const item of list) {
      await db.section.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse('Reorder Successful', { status: 200 });
  } catch (error) {
    console.log('[REORDER_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
