'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Button } from '../ui/button';

const TopBar = () => {
  const isSignedIn = useAuth();
  const topRoutes = [
    { label: 'Instructor', path: '/instructor/courses' },
    { label: 'Learning', path: '/learning' },
  ];
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <Image
          src="/Logo.png"
          height={50}
          width={200}
          alt="Logo"
          className="h-20"
        />
      </Link>
      <div className="max-md:hidden w-[400px] rounded-full flex">
        <input
          type="text"
          className="flex-grow bg-[#fff8eb] rounded-l-full border-none outline-none text-sm pl-4 py-3"
          placeholder="Search for courses"
        />
        <button
          className="bg-[#fdab04] rounded-r-full border none outline-none cursor-pointer px-4 py- hover:bg-[#fdab04]/80"
          type="button"
          onClick={() => {}}
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-6 items-center">
        <div className="max-sm:hidden flex gap-6">
          {topRoutes.map((route, index) => (
            <Link
              href={route.path}
              key={index}
              className="text-sm font-medium text-gray-600 hover:text-gray-600/80"
            >
              {route.label}
            </Link>
          ))}
        </div>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/sing-in" />
        ) : (
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#fdab04] hover:text-[#fdab04]/80"
          >
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBar;
