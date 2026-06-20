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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8000/api/ws/wschat/${roomId}`,
    );

    socketRef.current.onopen = () => setIsConnected(true);
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;

      setMessages((prev) => {
        if (prev.some((item) => item.messages_id === message.messages_id)) {
          return prev;
        }

        return [...prev, message];
      });
    };
    socketRef.current.onclose = () => setIsConnected(false);

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      setMessages([]);
      setIsConnected(false);
    };
  }, [roomId]);

  const sendMessage = (content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          content,
          room_id: roomId,
        }),
      );
    }
  };

  return { sendMessage, messages, isConnected };
};

export const useGetMessages = (roomId: string) => {
  const getMessages = async (): Promise<MessagesResponse> => {
    const response = await fetch(
      `http://localhost:8000/api/message/messages/${roomId}`,
      {
        credentials: "include",
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
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
