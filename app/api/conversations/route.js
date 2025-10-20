import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: session.user.id }
        }
      },
      include: {
        lastMessage: true,
        participants: {
          include: { user: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return Response.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, type, participants } = await req.json()

  try {
    const conversation = await prisma.conversation.create({
      data: {
        title,
        type,
        participants: {
          create: participants.map((userId) => ({ userId }))
        }
      }
    })
    return Response.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return Response.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}