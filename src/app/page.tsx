'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import ChatInfo from '@/components/ChatInfo';
import { Chat } from '@/types';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    checkAuth();
    loadChats();

    // Poll for new messages every 3 seconds
    const interval = setInterval(loadChats, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async () => {
    try {
      const url = searchQuery
        ? `/api/chats?search=${encodeURIComponent(searchQuery)}`
        : '/api/chats';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    setShowSidebar(false);

    // Load full chat details
    try {
      const response = await fetch(`/api/chats/${chat.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data.chat);
      }
    } catch (error) {
      console.error('Failed to load chat details:', error);
    }
  };

  const handleUpdateChat = async (updates: Partial<Chat>) => {
    if (!selectedChat) return;

    try {
      const response = await fetch(`/api/chats/${selectedChat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data.chat);
        loadChats();
      }
    } catch (error) {
      console.error('Failed to update chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChat) return;

    try {
      const response = await fetch('/api/webhook/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat.id,
          message,
        }),
      });

      if (response.ok) {
        // Reload chat to get new message
        const chatResponse = await fetch(`/api/chats/${selectedChat.id}`);
        if (chatResponse.ok) {
          const data = await chatResponse.json();
          setSelectedChat(data.chat);
          loadChats();
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelectedChat(null);
    setShowChatInfo(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-wa-bg-light">
        <div className="text-wa-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-wa-bg-light">
      {/* Sidebar - hidden on mobile when chat is selected */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[400px] lg:w-[30%] border-r border-wa-border bg-wa-panel`}>
        <Sidebar
          user={user}
          chats={chats}
          selectedChat={selectedChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onChatSelect={handleChatSelect}
          onLogout={handleLogout}
        />
      </div>

      {/* Chat Window */}
      <div className={`${!showSidebar || selectedChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        <ChatWindow
          chat={selectedChat}
          onSendMessage={handleSendMessage}
          onToggleChatInfo={() => setShowChatInfo(!showChatInfo)}
          onBack={handleBackToList}
        />
      </div>

      {/* Chat Info Panel */}
      {selectedChat && showChatInfo && (
        <div className="hidden lg:flex w-[400px] border-l border-wa-border bg-wa-panel">
          <ChatInfo
            chat={selectedChat}
            onUpdate={handleUpdateChat}
            onClose={() => setShowChatInfo(false)}
          />
        </div>
      )}

      {/* Mobile Chat Info Overlay */}
      {selectedChat && showChatInfo && (
        <div className="lg:hidden fixed inset-0 bg-wa-panel z-50">
          <ChatInfo
            chat={selectedChat}
            onUpdate={handleUpdateChat}
            onClose={() => setShowChatInfo(false)}
          />
        </div>
      )}
    </div>
  );
}
