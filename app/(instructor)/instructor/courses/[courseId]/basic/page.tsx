import React from 'react';
import EditCourseForm from '@/components/courses/EditCourseForm';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const CourseBasic = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      subCategories: true,
    },
  });

  const levels = await db.level.findMany();

  if (!course) {
    return redirect('/instructor/courses');
  }

  return (
    <div className="px-10">
      <EditCourseForm
        course={course}
        categories={categories?.map((cat) => ({
          label: cat.name,
          value: cat.id,
          subCategories: cat.subCategories?.map((subCat) => ({
            label: subCat.name,
            value: subCat.id,
          })),
        }))}
        levels={levels.map((level) => ({
          label: level.name,
          value: level.id,
        }))}
      />
    </div>
  );
};

export default CourseBasic;
