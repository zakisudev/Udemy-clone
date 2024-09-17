import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const POST = async (req: NextResponse) => {
    try {
        const {userId} = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {title, categoryId, subCategoryId} = await req.json();

        const newCourse = await db.course.create({
            data: {
                title,
                categoryId,
                subCategoryId,
                instructorId: userId
            }
        });

        return NextResponse.json(newCourse, { status: 201});
    } catch (error) {
        console.log("[COURSES POST] /api/courses", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}