import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Get all chats for the business
    const chats = await prisma.chat.findMany({
      where: {
        businessId: payload.businessId,
        ...(search && {
          OR: [
            { chatId: { contains: search } },
            { contactName: { contains: search } },
            { labels: { some: { name: { contains: search } } } },
          ],
        }),
      },
      include: {
        labels: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: {
        lastMessageTime: 'desc',
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
