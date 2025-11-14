import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create businesses
  const business1 = await prisma.business.upsert({
    where: { id: 'business-1' },
    update: {},
    create: {
      id: 'business-1',
      name: 'Demo Business 1',
      webhookChatRecordUrl: 'https://example.com/webhook/chat-record',
      webhookSendMessageUrl: 'https://example.com/webhook/send-message',
      webhookUserReplyUrl: 'https://example.com/webhook/user-reply',
    },
  });

  const business2 = await prisma.business.upsert({
    where: { id: 'business-2' },
    update: {},
    create: {
      id: 'business-2',
      name: 'Demo Business 2',
    },
  });

  console.log('Created businesses:', business1.name, business2.name);

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@business1.com' },
    update: {},
    create: {
      email: 'admin@business1.com',
      username: 'Admin User',
      passwordHash,
      businessId: business1.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@business2.com' },
    update: {},
    create: {
      email: 'admin@business2.com',
      username: 'Admin User 2',
      passwordHash,
      businessId: business2.id,
    },
  });

  console.log('Created users:', user1.email, user2.email);

  // Create sample chats for business 1
  const chat1 = await prisma.chat.create({
    data: {
      businessId: business1.id,
      chatId: '+1234567890',
      contactName: 'John Doe',
      notes: 'Interested in our premium package',
      status: 'In Progress',
      lastMessage: 'Thanks for the information!',
      lastMessageTime: new Date(),
    },
  });

  const chat2 = await prisma.chat.create({
    data: {
      businessId: business1.id,
      chatId: '+9876543210',
      contactName: 'Jane Smith',
      notes: '',
      status: 'New',
      lastMessage: 'Hello, I need help',
      lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
    },
  });

  console.log('Created chats for business 1');

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        chatId: chat1.id,
        direction: 'incoming',
        content: 'Hi, I would like to know more about your services',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        chatId: chat1.id,
        direction: 'outgoing',
        content: 'Hello! I would be happy to help you. We offer various packages...',
        timestamp: new Date(Date.now() - 7000000),
      },
      {
        chatId: chat1.id,
        direction: 'incoming',
        content: 'Thanks for the information!',
        timestamp: new Date(),
      },
      {
        chatId: chat2.id,
        direction: 'incoming',
        content: 'Hello, I need help',
        timestamp: new Date(Date.now() - 3600000),
      },
    ],
  });

  console.log('Created sample messages');

  // Create sample labels
  await prisma.label.createMany({
    data: [
      {
        chatId: chat1.id,
        name: 'Hot Lead',
        color: '#F15C6D',
      },
      {
        chatId: chat1.id,
        name: 'Premium',
        color: '#FFC033',
      },
      {
        chatId: chat2.id,
        name: 'New Customer',
        color: '#00A884',
      },
    ],
  });

  console.log('Created sample labels');

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Test credentials:');
  console.log('Business 1: admin@business1.com / password123');
  console.log('Business 2: admin@business2.com / password123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
