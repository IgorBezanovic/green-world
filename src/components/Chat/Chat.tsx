import { useConversation } from '@green-world/hooks/useConversation';
import { useMarkAsRead } from '@green-world/hooks/useMarkAsRead';
import { useSendMessage } from '@green-world/hooks/useSendMessage';
import { getItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt?: string;
}

interface ChatProps {
  chatWithId: string;
  onClose: () => void;
}

export const Chat = ({ chatWithId, onClose }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data, isLoading } = useConversation(chatWithId);
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkAsRead();
  const alreadyMarked = useRef<string | null>(null);

  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const currentUser = decodedToken?._id;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.APP_URL, {
      transports: ['websocket'],
      autoConnect: true
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatWithId && alreadyMarked.current !== chatWithId) {
      markAsRead.mutate(chatWithId);
      alreadyMarked.current = chatWithId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWithId]);

  useEffect(() => {
    if (data?.success && data.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.emit('join', currentUser);

    const handleReceiveMessage = (msg: Message) => {
      if (msg.sender === chatWithId || msg.sender === currentUser) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, currentUser, chatWithId]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    sendMessageMutation.mutate(
      { receiverId: chatWithId, content: message },
      {
        onSuccess: () => {
          const msg: Message = {
            sender: currentUser?.toString() || '',
            receiver: chatWithId,
            content: message,
            createdAt: new Date().toISOString()
          };
          socket.emit('private_message', msg);
          setMessages((prev) => [...prev, msg]);
          setMessage('');
        }
      }
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 320,
        height: 420,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #eee',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Chat
        <span style={{ cursor: 'pointer' }} onClick={onClose}>
          ✖
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {isLoading && <div>Učitavanje...</div>}
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: 8
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  background: isMe ? '#DCF8C6' : '#eee',
                  border: '1px solid #ddd'
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: 'flex',
          padding: 8,
          borderTop: '1px solid #eee'
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napiši poruku..."
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 4,
            padding: '6px 10px',
            borderRadius: 4,
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Pošalji
        </button>
      </div>
    </div>
  );
};

export default Chat;
