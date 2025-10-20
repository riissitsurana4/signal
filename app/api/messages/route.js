import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(req) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
        return new Response(JSON.stringify({ error: "conversation is required" }), { status: 400 })
    }

    try {
        const messages = await prisma.message.findMany({
            where: { conversationId: conversationId },
            include: { sender: true },
            orderBy: { createdAt: 'asc' }
        })

        return Response.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return Response.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { content, conversationId } = await request.json()

    if (!content || !conversationId) {
        return Response.json({ error: 'Content and conversationId required' }, { status: 400 })
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                conversationId,
                senderId: session.user.id
            },
            include: { sender: true }
        })
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageId: message.id, updatedAt: new Date() }
        })

        return Response.json(message)
    } catch (error) {
        console.error('Error sending message:', error)
        return Response.json({ error: 'Failed to send message' }, { status: 500 })
    }
}

export async function DELETE(request) {

    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    if (!messageId) {
        return Response.json({ error: 'messageId is required' }, { status: 400 });
    }

    try {
        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { conversation: { include: { participants: true } } }  // Include conversation for checks
        });

        if (!message) {
            return Response.json({ error: 'Message not found' }, { status: 404 });
        }
        if (message.senderId !== session.user.id) {
            return Response.json({ error: 'Forbidden: You can only delete your own messages' }, { status: 403 });
        }
        const isParticipant = message.conversation.participants.some(p => p.userId === session.user.id);
        if (!isParticipant) {
            return Response.json({ error: 'Forbidden: Not a participant in this conversation' }, { status: 403 });
        }

        await prisma.message.delete({
            where: { id: messageId }
        });
        const lastMessage = await prisma.message.findFirst({
            where: { conversationId: message.conversationId },
            orderBy: { createdAt: 'desc' }
        });
        if (lastMessage) {
            await prisma.conversation.update({
                where: { id: message.conversationId },
                data: { lastMessageId: lastMessage.id }
            });
        } else {
            await prisma.conversation.update({
                where: { id: message.conversationId },
                data: { lastMessageId: null }
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}