# WhatsApp Web Style Multi-Tenant Inbox

A multi-tenant web platform that replicates the WhatsApp Web experience, designed for businesses to manage customer conversations, add internal notes, labels, and statuses, and integrate with automation workflows via webhooks.

## Features

- **WhatsApp Web Clone UI**: Familiar WhatsApp Web interface with dark theme
- **Multi-Tenant Architecture**: Complete business separation with businessId filtering
- **Login-Only Authentication**: Pre-created users (no registration)
- **Real-Time Chat Management**: View and manage all conversations
- **Message History**: Full conversation history with incoming/outgoing messages
- **Internal Notes**: Team-shared notes per conversation
- **Labels/Tags**: Customizable color-coded labels for organizing chats
- **Status Management**: Track conversation status (New, In Progress, Waiting, Closed)
- **Webhook Integration**: Connect with n8n or other automation platforms
- **Mobile Responsive**: Fully responsive design for desktop and mobile devices
- **Settings Management**: Configure webhook URLs per business

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Styling**: TailwindCSS with custom WhatsApp color palette
- **Real-time**: Polling (3-second intervals)

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WHATSAPPPROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Seed the database with sample data**
   ```bash
   npm run prisma:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## Default Test Credentials

After seeding the database, you can log in with:

- **Business 1**:
  - Email: `admin@business1.com`
  - Password: `password123`

- **Business 2**:
  - Email: `admin@business2.com`
  - Password: `password123`

## Webhook API Endpoints

### 1. Chat Record (Incoming Webhook)

Records messages from bot and user conversations.

**Endpoint**: `POST /api/webhook/chat-record`

**Request Body**:
```json
{
  "businessId": "business-1",
  "chatId": "+1234567890",
  "direction": "incoming",
  "message": "Hello, I need help",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "chatId": "chat-id"
}
```

### 2. User Reply (Incoming Webhook)

Receives user replies from WhatsApp.

**Endpoint**: `POST /api/webhook/user-reply`

**Request Body**:
```json
{
  "businessId": "business-1",
  "chatId": "+1234567890",
  "message": "Thanks for the help!",
  "timestamp": "2025-01-01T12:05:00Z"
}
```

**Response**:
```json
{
  "success": true
}
```

### 3. Send Message (Outgoing Webhook)

Called by the platform when an agent sends a message. Your n8n workflow should handle this to send messages via WhatsApp.

**Your Webhook Receives**: `POST <your-configured-send-message-url>`

**Request Body**:
```json
{
  "businessId": "business-1",
  "chatId": "+1234567890",
  "message": "Agent message content"
}
```

## Database Schema

### Business
- `id`: Unique business identifier
- `name`: Business name
- `webhookChatRecordUrl`: URL for chat recording webhook
- `webhookSendMessageUrl`: URL for sending messages webhook
- `webhookUserReplyUrl`: URL for user reply webhook

### User
- `id`: Unique user identifier
- `email`: User email (login credential)
- `passwordHash`: Hashed password
- `businessId`: Associated business

### Chat
- `id`: Unique chat identifier
- `businessId`: Associated business
- `chatId`: Phone number or unique identifier
- `contactName`: Display name
- `notes`: Internal team notes
- `status`: Conversation status
- `lastMessage`: Last message preview
- `lastMessageTime`: Timestamp of last message

### Message
- `id`: Unique message identifier
- `chatId`: Associated chat
- `direction`: "incoming" or "outgoing"
- `content`: Message text
- `timestamp`: Message timestamp

### Label
- `id`: Unique label identifier
- `chatId`: Associated chat
- `name`: Label name
- `color`: Hex color code

## Multi-Tenancy

All data is strictly separated by `businessId`:

- Users can only see chats for their business
- All API queries filter by businessId
- Webhook calls must include businessId
- No cross-business data leakage

## Usage

### For Team Members

1. **Login**: Use your pre-created credentials
2. **View Chats**: See all conversations in the left sidebar
3. **Select Chat**: Click a conversation to view messages
4. **Send Messages**: Type and send messages to customers
5. **Add Notes**: Click the info icon to add internal notes
6. **Add Labels**: Tag conversations for organization
7. **Update Status**: Track conversation progress

### For Administrators

1. **Settings**: Click the gear icon to configure webhooks
2. **Add Webhook URLs**: Configure your n8n or automation endpoints
3. **Manage Users**: Add users directly in the database

## Creating New Users

Since there's no registration UI, create users via Prisma Studio or directly in the database:

```bash
npm run prisma:studio
```

Or using code:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash('password', 10);

await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash,
    businessId: 'your-business-id',
  },
});
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data

## Mobile Experience

The platform is fully responsive:

- **Desktop**: Sidebar and chat window side-by-side
- **Mobile**: Toggle between chat list and active conversation
- **Tablet**: Optimized layout for medium screens

## Production Deployment

1. **Environment Variables**: Update production values
2. **Database**: Migrate to PostgreSQL for production
3. **JWT Secret**: Use a strong, unique secret
4. **HTTPS**: Enable secure cookies in production
5. **Webhook URLs**: Configure production n8n endpoints

### Database Migration to PostgreSQL

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Run migrations:
```bash
npm run prisma:migrate
```

## Security Considerations

- Passwords are hashed with bcrypt
- JWT tokens stored in httpOnly cookies
- All API routes validate businessId access
- CSRF protection via SameSite cookies
- Input validation on all endpoints

## Troubleshooting

### Login Issues
- Verify user exists in database
- Check password is correct
- Clear browser cookies

### Webhooks Not Working
- Verify URLs in Settings page
- Check n8n is running and accessible
- Test webhook endpoints with curl/Postman

### Messages Not Appearing
- Check businessId is correct
- Verify chat exists in database
- Check browser console for errors

## Support

For issues or questions, please check:
- Database logs
- Browser console
- Server console output

## License

MIT License - See LICENSE file for details
