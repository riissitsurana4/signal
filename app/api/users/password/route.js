//used for changing password
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request){
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();
    try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { passwordHash: hashedPassword } 
        });
        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}