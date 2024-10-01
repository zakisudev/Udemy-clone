import React from 'react';
import EditCourseForm from '@/components/courses/EditCourseForm';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import AlertBanner from '@/components/custom/AlertBanner';

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
    include: {
      sections: true,
    },
  });

  if (!course) {
    return redirect('/instructor/courses');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      subCategories: true,
    },
  });

  const levels = await db.level.findMany();

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.subCategoryId,
    course.imageUrl,
    course.levelId,
    course.price,
    course.sections.some((section) => section.isPublished),
  ];
  const requiredFieldsCount = requiredFields.length;

  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;

  const isCompleted = requiredFields.every(Boolean);

  if (!course) {
    return redirect('/instructor/courses');
  }

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />
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
