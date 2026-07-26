import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export interface Message {
  messages_id: string;
  room_id: string;
  message: string;
  sender_id: string;
  updated_at: string;
  created_at: string;
}

export interface MessagesResponse {
  status: string;
  result: number;
  data: Message[];
}

export const useChat = (roomId: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

//   i learnt something new, now i noticed every docs and paper i read on this their websocket code is usually wrapped in a useffect; 
//   the reason why that is, is for UX reasons whereby you would need an automatic websocket connection without a button trigger when 
//   you mount a page and an automatic disconnection when you unmount or leave the page
// i said UX reasons because for a chat app it doesn't make any sense to need a button to connect just text someone else when you shouldn't 
// even be thinking of that when you want to text, although there are several pages or functions where making the connection trigger manually by the users
  useEffect(() => {
    if (!roomId) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    console.log('[useChat] connecting websocket', { roomId });
    setConnectionState('connecting');
    socketRef.current = new WebSocket(
      `ws://localhost:8000/api/ws/wschat/${roomId}`,
    );
    console.log("connecting and establshing a http handshake.....")
    socketRef.current.onopen = () => {
      console.log('[useChat] websocket connected', { roomId });
      console.log("Connected to server");
      setConnectionState('connected');
    };
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;

      console.log('[useChat] websocket message received', { roomId, message });

      setMessages((prev) => {
        if (prev.some((item) => item.messages_id === message.messages_id)) {
          return prev;
        }

        return [...prev, message];
      });
    };
    socketRef.current.onerror = (event) => {
      console.error('[useChat] websocket error', { roomId, event });
      setConnectionState('disconnected');
    };
    socketRef.current.onclose = () => {
      console.log('[useChat] websocket closed', { roomId });
      setConnectionState('disconnected');
    };

    return () => {
      console.log('[useChat] cleaning up websocket', { roomId });
      socketRef.current?.close();
      socketRef.current = null;
      setMessages([]);
      setConnectionState('disconnected');
    };
  }, [roomId]);

  const sendMessage = (content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('[useChat] sending websocket message', { roomId, content });
      socketRef.current.send(
        JSON.stringify({
          content,
          room_id: roomId,
        }),
      );
      return;
    }

    console.warn('[useChat] cannot send message because websocket is not open', {
      roomId,
      readyState: socketRef.current?.readyState,
      content,
    });
  };

  return { sendMessage, messages, connectionState };
};

export const useGetMessages = (roomId: string) => {
  const getMessages = async (): Promise<MessagesResponse> => {
    console.log('[useGetMessages] fetching messages', { roomId });
    const response = await fetch(
      `http://localhost:8000/api/message/messages/${roomId}`,
      {
        credentials: "include",
        method: "GET",
      },
    );

    if (!response.ok) {
      console.error('[useGetMessages] fetch failed', {
        roomId,
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    console.log('[useGetMessages] fetch succeeded', { roomId, data });
    return data;
  };

  const { data: messages, isLoading, error, refetch } = useQuery({
    queryFn: getMessages,
    queryKey: ["messages", roomId],
    retry: false,
    staleTime: 0,
    enabled: !!roomId,
  });

  return { getMessages, messages, isLoading, error, refetch };
};
