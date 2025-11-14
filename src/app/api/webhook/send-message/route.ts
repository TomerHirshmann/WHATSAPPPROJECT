import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { chatId: chatDbId, message } = body;

    if (!chatDbId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get chat details
    const chat = await prisma.chat.findUnique({
      where: { id: chatDbId },
      include: { business: true },
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Verify business access
    if (chat.businessId !== payload.businessId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Store message in database
    await prisma.message.create({
      data: {
        chatId: chat.id,
        direction: 'outgoing',
        content: message,
        timestamp: new Date(),
      },
    });

    // Update last message
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        lastMessage: message,
        lastMessageTime: new Date(),
      },
    });

    // Call external webhook if configured
    if (chat.business.webhookSendMessageUrl) {
      try {
        await fetch(chat.business.webhookSendMessageUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: chat.businessId,
            chatId: chat.chatId,
            message,
          }),
        });
      } catch (webhookError) {
        console.error('Webhook call failed:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
