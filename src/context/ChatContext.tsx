import { getItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt?: string;
}

export interface OpenChat {
  userId: string;
  userName: string;
}

interface ChatContextType {
  socket: Socket | null;
  openChats: OpenChat[];
  openChat: (userId: string, userName: string) => void;
  closeChat: (userId: string) => void;
  messages: Record<string, Message[]>;
  addMessage: (chatWithId: string, message: Message) => void;
}

export const ChatContext = createContext<ChatContextType>({
  socket: null,
  openChats: [],
  openChat: () => {},
  closeChat: () => {},
  messages: {},
  addMessage: () => {}
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const token = getItem('token');
  const decoded: DecodedToken | null = token ? jwtDecode(token) : null;
  const currentUser = decoded?._id;

  useEffect(() => {
    if (!currentUser) return;
    const s = io(import.meta.env.VITE_API_URL, {
      query: { userId: currentUser }
    });
    setSocket(s);

    s.on('receive_message', (msg: Message) => {
      setMessages((prev) => ({
        ...prev,
        [msg.sender]: [...(prev[msg.sender] || []), msg]
      }));
    });

    return () => {
      s.disconnect();
    };
  }, [currentUser]);

  const openChat = (userId: string, userName: string) => {
    setOpenChats((prev) => {
      const exists = prev.some((chat) => chat.userId === userId);
      if (exists) return prev;
      return [...prev, { userId, userName }];
    });
  };

  const closeChat = (userId: string) => {
    setOpenChats((prev) => prev.filter((chat) => chat.userId !== userId));
  };

  const addMessage = (chatWithId: string, newMessages: Message | Message[]) => {
    setMessages((prev) => {
      const current = prev[chatWithId] || [];
      const msgs = Array.isArray(newMessages)
        ? [...current, ...newMessages]
        : [...current, newMessages];

      const unique = msgs.filter(
        (msg, index, self) => index === self.findIndex((m) => m._id === msg._id)
      );

      return { ...prev, [chatWithId]: unique };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        openChats,
        openChat,
        closeChat,
        messages,
        addMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
