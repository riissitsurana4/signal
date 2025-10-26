//using for fetching and updating user details
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import  prisma  from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                id: { not: session.user.id } 
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name, email } = await request.json();

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { name, email },
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating details:', error);
        return NextResponse.json({ error: 'Failed to update details' }, { status: 500 });
    }
}