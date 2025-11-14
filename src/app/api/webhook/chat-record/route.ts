import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, chatId, direction, message, timestamp } = body;

    // Validate required fields
    if (!businessId || !chatId || !direction || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Find or create chat
    let chat = await prisma.chat.findUnique({
      where: {
        businessId_chatId: {
          businessId,
          chatId,
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          businessId,
          chatId,
          contactName: chatId,
          lastMessage: message,
          lastMessageTime: timestamp ? new Date(timestamp) : new Date(),
        },
      });
    } else {
      // Update last message
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          lastMessage: message,
          lastMessageTime: timestamp ? new Date(timestamp) : new Date(),
        },
      });
    }

    // Create message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        direction,
        content: message,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true, chatId: chat.id });
  } catch (error) {
    console.error('Chat record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
