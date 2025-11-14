import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, chatId, message, timestamp } = body;

    // Validate required fields
    if (!businessId || !chatId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find chat
    const chat = await prisma.chat.findUnique({
      where: {
        businessId_chatId: {
          businessId,
          chatId,
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Update chat with new message
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        lastMessage: message,
        lastMessageTime: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    // Create message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        direction: 'incoming',
        content: message,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
