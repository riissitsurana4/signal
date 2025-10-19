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