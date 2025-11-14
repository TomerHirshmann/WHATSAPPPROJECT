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

    const business = await prisma.business.findUnique({
      where: { id: payload.businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Get business settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { webhookChatRecordUrl, webhookSendMessageUrl, webhookUserReplyUrl } = body;

    const business = await prisma.business.update({
      where: { id: payload.businessId },
      data: {
        ...(webhookChatRecordUrl !== undefined && { webhookChatRecordUrl }),
        ...(webhookSendMessageUrl !== undefined && { webhookSendMessageUrl }),
        ...(webhookUserReplyUrl !== undefined && { webhookUserReplyUrl }),
      },
    });

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Update business settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
