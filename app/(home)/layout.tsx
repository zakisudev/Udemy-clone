import React from 'react';
import TopBar from '../../components/layout/TopBar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1440px] w-full mx-auto">
      <TopBar />
      {children}
    </div>
  );
};

export default HomeLayout;
