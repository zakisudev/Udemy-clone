import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const courses = await db.course.findMany({
    where: {
      instructorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create Course</Button>
      </Link>

      <div className="mt-10">
        {courses?.map((course) => (
          <Link
            href={`/instructor/courses/${course.id}/basic`}
            key={course.id}
            className="flex justify-between items-center border-b border-gray-300 py-2"
          >
            <div>
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.category}</p>
            </div>
            <div>
              <Button>Edit</Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
