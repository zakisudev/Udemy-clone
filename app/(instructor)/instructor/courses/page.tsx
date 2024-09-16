import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '../../../../components/ui/button';

const CoursesPage = () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create Course</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
