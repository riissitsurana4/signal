import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json()
        if (!name || !email || !password) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: passwordHash
            },
        });

        return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}