import { useState } from 'react';
import { Chat } from '@/types';
import { format } from 'date-fns';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  onToggleChatInfo: () => void;
  onBack: () => void;
}

export default function ChatWindow({
  chat,
  onSendMessage,
  onToggleChatInfo,
  onBack,
}: ChatWindowProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-wa-bg text-wa-text-secondary">
        <svg
          className="w-32 h-32 mb-8 opacity-20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <p className="text-lg">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-wa-bg">
      {/* Header */}
      <div className="bg-wa-panel-header px-4 py-3 flex items-center justify-between border-b border-wa-border">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-wa-hover rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-wa-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="w-10 h-10 bg-wa-text-secondary rounded-full flex items-center justify-center text-wa-bg font-semibold">
            {(chat.contactName || chat.chatId)[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-wa-text font-medium">
              {chat.contactName || chat.chatId}
            </h2>
            <p className="text-wa-text-secondary text-xs">
              {chat.chatId}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleChatInfo}
          className="p-2 hover:bg-wa-hover rounded-full transition-colors"
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%230b141a\' fill-opacity=\'1\'/%3E%3Cpath d=\'M50 0L0 50l50 50 50-50L50 0zm0 10l40 40-40 40-40-40 40-40z\' fill=\'%23ffffff\' fill-opacity=\'0.02\'/%3E%3C/svg%3E")',
        }}
      >
        {chat.messages && chat.messages.length === 0 && (
          <div className="text-center text-wa-text-secondary">
            No messages yet
          </div>
        )}
        {chat.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[65%] rounded-lg px-3 py-2 ${
                msg.direction === 'outgoing'
                  ? 'bg-wa-outgoing'
                  : 'bg-wa-incoming'
              }`}
            >
              <p className="text-wa-text text-sm whitespace-pre-wrap break-words">
                {msg.content}
              </p>
              <p className="text-wa-text-secondary text-xs mt-1 text-right">
                {format(new Date(msg.timestamp), 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-wa-panel-header px-4 py-3 border-t border-wa-border">
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-wa-bg rounded-lg px-4 py-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              rows={1}
              className="w-full bg-transparent text-wa-text resize-none focus:outline-none"
              style={{ maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-wa-primary hover:bg-wa-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
