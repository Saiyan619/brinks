import { useMemo, useState } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { useGetMe } from '@/apiServices/userApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Info, MoreVertical, Send, Paperclip, MessageCircleCode, MessageCircleQuestionMarkIcon } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { type Message, useChat, useGetMessages } from '@/apiServices/messageApi';

const mergeMessages = (fetchedMessages: Message[] = [], socketMessages: Message[] = []) => {
  const messagesById = new Map<string, Message>();

  [...fetchedMessages, ...socketMessages].forEach((message) => {
    messagesById.set(message.messages_id, message);
  });

  return Array.from(messagesById.values()).sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
};

const formatMessageTime = (timestamp: string) => {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

const getMessageText = (message: Message) => {
  try {
    const parsedMessage = JSON.parse(message.message);

    if (typeof parsedMessage?.content === 'string') {
      return parsedMessage.content;
    }
  } catch {
    return message.message;
  }

  return message.message;
};

export default function ChatLayout() {
  const { user } = useGetMe();
  const [messageInput, setMessageInput] = useState('');
  const { room_id } = useParams();
  const location = useLocation();
  const selectedUser = location.state?.user;
  const currentUserId = user?.data.id;

  const {
    sendMessage,
    isConnected,
    messages: socketMessages,
  } = useChat(room_id || '');
  const {
    messages: fetchedMessages,
    isLoading,
    error,
    refetch,
  } = useGetMessages(room_id || '');

  const chatMessages = useMemo(() => {
    return mergeMessages(fetchedMessages?.data, socketMessages);
  }, [fetchedMessages?.data, socketMessages]);

  const handleSendMessage = () => {
    const content = messageInput.trim();

    if (!content) return;

    sendMessage(content);
    setMessageInput('');
  };

  const currentChat = selectedUser ? {
    name: selectedUser.username,
    status: isConnected ? 'Connected' : 'Connecting...',
    avatar: `https://i.pravatar.cc/150?u=${selectedUser.username}`,
  } : {
    name: 'Select a user',
    status: 'No chat selected',
    avatar: 'https://i.pravatar.cc/150?u=default',
  };

  return (
    <SidebarInset>
      <div className="flex h-screen flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
              <AvatarFallback>{currentChat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{currentChat.name}</p>
              <p className="text-xs text-gray-600">{currentChat.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <p className="text-center text-sm text-gray-500">Loading messages...</p>
          )}

          {error && (
            <p className="text-center text-sm text-red-500">Failed to load messages.</p>
          )}

          {!isLoading && !error && chatMessages.length === 0 && (
            <p className="text-center text-sm text-gray-500">No messages yet.</p>
          )}

          <div className="space-y-4">
            {chatMessages.map((msg) => {
              const isSelf = msg.sender_id === currentUserId;

              return (
                <div
                  key={msg.messages_id}
                  className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-3 ${
                      isSelf
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{getMessageText(msg)}</p>
                    <p className={`mt-2 text-xs ${isSelf ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 p-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Paperclip className="h-4 w-4 text-gray-600" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-full border-gray-200 bg-gray-50 focus-visible:ring-1"
          />
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSendMessage}
            disabled={!isConnected || !messageInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => refetch()}
            disabled={!room_id || isLoading}
          >
            {isLoading ? <MessageCircleQuestionMarkIcon className="h-4 w-4" /> : <MessageCircleCode className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </SidebarInset>
  );
}
