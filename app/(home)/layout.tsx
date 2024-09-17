import React from 'react';
import TopBar from '../../components/layout/TopBar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  );
};

export default HomeLayout;
