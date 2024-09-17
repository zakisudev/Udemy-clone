import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default InstructorLayout;
