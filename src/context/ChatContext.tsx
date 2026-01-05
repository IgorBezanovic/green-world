import { getItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState, ReactNode } from 'react';

import { socket } from '../utils/socket';

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
  socket: any;
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
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const token = getItem('token');
  const decoded: DecodedToken | null = token ? jwtDecode(token) : null;
  const currentUser = decoded?._id;

  useEffect(() => {
    if (!currentUser) return;

    // postavi auth pre connect
    socket.auth = { userId: currentUser };

    if (!socket.connected) socket.connect();

    const onConnect = () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join', currentUser);
    };

    const onConnectError = (err: any) => {
      console.error('❌ Socket connect_error:', err.message, err);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);

      // opciono: ako želiš da se skroz ugasi kad nema usera
      // socket.disconnect();
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

      return { ...prev, [chatWithId]: msgs };
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
