import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const instructorLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default instructorLayout;
