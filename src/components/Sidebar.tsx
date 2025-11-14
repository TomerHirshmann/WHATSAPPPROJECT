import { Chat, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface SidebarProps {
  user: User | null;
  chats: Chat[];
  selectedChat: Chat | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chat: Chat) => void;
  onLogout: () => void;
}

export default function Sidebar({
  user,
  chats,
  selectedChat,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onLogout,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-wa-panel-header px-4 py-3 flex items-center justify-between border-b border-wa-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-wa-text-secondary rounded-full flex items-center justify-center text-wa-bg font-semibold">
            {user?.email[0].toUpperCase()}
          </div>
          <div>
            <div className="text-wa-text text-sm font-medium">
              {user?.businessName}
            </div>
            <div className="text-wa-text-secondary text-xs">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/settings"
            className="p-2 hover:bg-wa-hover rounded-full transition-colors"
            title="Settings"
          >
            <svg
              className="w-5 h-5 text-wa-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-wa-hover rounded-full transition-colors"
            title="Logout"
          >
            <svg
              className="w-5 h-5 text-wa-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-wa-border">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 bg-wa-bg rounded-lg text-wa-text text-sm focus:outline-none"
          />
          <svg
            className="w-4 h-4 text-wa-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-wa-text-secondary px-4 text-center">
            <svg
              className="w-16 h-16 mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`px-4 py-3 hover:bg-wa-hover cursor-pointer border-b border-wa-border transition-colors ${
                selectedChat?.id === chat.id ? 'bg-wa-hover' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-wa-text-secondary rounded-full flex-shrink-0 flex items-center justify-center text-wa-bg font-semibold">
                  {(chat.contactName || chat.chatId)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-wa-text font-medium truncate">
                      {chat.contactName || chat.chatId}
                    </h3>
                    {chat.lastMessageTime && (
                      <span className="text-wa-text-secondary text-xs flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(chat.lastMessageTime), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-wa-text-secondary text-sm truncate">
                      {chat.lastMessage || 'No messages'}
                    </p>
                  </div>
                  {/* Labels */}
                  {chat.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {chat.labels.slice(0, 2).map((label) => (
                        <span
                          key={label.id}
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: `${label.color}20`,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                      {chat.labels.length > 2 && (
                        <span className="text-wa-text-secondary text-xs">
                          +{chat.labels.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
