import UserContext from '@green-world/context/UserContext';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt?: string;
  isRead?: boolean;
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
  addMessage: (chatWithId: string, message: Message | Message[]) => void;
  markMessagesAsSeen: (chatWithId: string, senderId: string) => void;
}

export const ChatContext = createContext<ChatContextType>({
  socket: null,
  openChats: [],
  openChat: () => {},
  closeChat: () => {},
  messages: {},
  addMessage: () => {},
  markMessagesAsSeen: () => {}
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { userId: currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) return;
    const s = io(import.meta.env.VITE_API_SOCKET, {
      path: '/socket.io',
      query: { userId: currentUser }
    });
    s.on('connect', () => {
      s.emit('join', currentUser);
    });
    s.on('connect_error', (err) => {
      console.error('❌ Socket connect_error:', err.message, err);
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    const handleLogout = () => {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      setOpenChats([]);
      setMessages({});
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [socket]);

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
      const incoming = Array.isArray(newMessages) ? newMessages : [newMessages];

      const dedupedIncoming = incoming.filter((candidate) => {
        return !current.some((existing) => {
          if (candidate._id && existing._id) {
            return candidate._id === existing._id;
          }

          const sameContent =
            candidate.sender === existing.sender &&
            candidate.receiver === existing.receiver &&
            candidate.content === existing.content;

          if (!sameContent) {
            return false;
          }

          if (!candidate.createdAt || !existing.createdAt) {
            return true;
          }

          return (
            Math.abs(
              new Date(candidate.createdAt).getTime() -
                new Date(existing.createdAt).getTime()
            ) < 3000
          );
        });
      });

      const msgs = [...current, ...dedupedIncoming];

      return { ...prev, [chatWithId]: msgs };
    });
  };

  const markMessagesAsSeen = (chatWithId: string, senderId: string) => {
    setMessages((prev) => {
      const current = prev[chatWithId] || [];
      if (current.length === 0) return prev;

      const next = current.map((msg) =>
        msg.sender === senderId ? { ...msg, isRead: true } : msg
      );

      return { ...prev, [chatWithId]: next };
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
        addMessage,
        markMessagesAsSeen
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
