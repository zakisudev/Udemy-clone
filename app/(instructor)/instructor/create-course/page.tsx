import React from 'react';
import CreateCourseForm from '@/components/courses/CreateCourseForm';
import { db } from '@/lib/db';

const CreateCourse = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      subCategories: true,
    },
  });

  return (
    <div>
      {categories && (
        <CreateCourseForm
          categories={categories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
            subCategories: cat.subCategories?.map((subCat) => ({
              label: subCat.name,
              value: subCat.id,
            })),
          }))}
        />
      )}
    </div>
  );
};

export default CreateCourse;
