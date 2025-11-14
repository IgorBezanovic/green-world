import { ChatContext, Message as Msg } from '@green-world/context/ChatContext';
import { useConversation } from '@green-world/hooks/useConversation';
import { useMarkAsRead } from '@green-world/hooks/useMarkAsRead';
import { useSendMessage } from '@green-world/hooks/useSendMessage';
import { getItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import {
  useTheme,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef, useContext } from 'react';

interface ChatProps {
  chatWithId: string;
  userName: string;
  stylePosition?: { right: number };
  index?: number;
  onClose?: () => void;
}

export const Chat = ({
  chatWithId,
  stylePosition,
  index = 0,
  userName,
  onClose
}: ChatProps) => {
  const { socket, addMessage, closeChat, messages } = useContext(ChatContext);
  const theme = useTheme();

  const [message, setMessage] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState(false);
  const { data, isLoading, refetch } = useConversation(chatWithId);
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkAsRead();
  const alreadyMarked = useRef<string | null>(null);
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const currentUser = decodedToken?._id;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // broj prikazanih poruka (početno 10)
  const [visibleCount, setVisibleCount] = useState(10);

  // ref za chat container
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef<number>(0);

  // kada se skroluje, proverava da li je na vrhu
  const handleScroll = () => {
    const box = chatBoxRef.current;
    if (box && box.scrollTop === 0) {
      // zapamti trenutnu visinu
      prevScrollHeightRef.current = box.scrollHeight;

      setVisibleCount((prev) => prev + 10);
    }
  };

  // kada se visibleCount promeni, zadrži poziciju skrola
  useEffect(() => {
    const box = chatBoxRef.current;
    if (box && prevScrollHeightRef.current) {
      const diff = box.scrollHeight - prevScrollHeightRef.current;
      box.scrollTop = diff; // zadrži istu poziciju
    }
  }, [visibleCount]);

  useEffect(() => {
    if (data?.success && Array.isArray(data.data)) {
      const existing = messages[chatWithId] || [];

      // 🔹 filtriraj samo one koje nisu već u lokalnom stanju
      const newMessages = data.data.filter(
        (apiMsg: Msg) => !existing.some((m: Msg) => m._id === apiMsg._id)
      );

      if (newMessages.length > 0) {
        // 🔹 dodaj samo ako nije duplikat (API može vratiti i našu novu poruku)
        newMessages.forEach((msg: Msg) => {
          // ako poruka sadrži isti content i vreme kao lokalno dodata, preskoči
          const duplicate = existing.some(
            (m: Msg) =>
              m.content === msg.content &&
              Math.abs(
                new Date(m.createdAt || '').getTime() -
                  new Date(msg.createdAt || '').getTime()
              ) < 3000 // razlika manja od 3 sekunde → smatraj da je ista poruka
          );

          if (!duplicate) addMessage(chatWithId, msg);
        });
      }
    }
  }, [data, messages, chatWithId, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatWithId, messages]);

  useEffect(() => {
    if (chatWithId && alreadyMarked.current !== chatWithId) {
      markAsRead.mutate(chatWithId);
      alreadyMarked.current = chatWithId;
    }
  }, [chatWithId, markAsRead]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const msg: Msg = {
      sender: currentUser!,
      receiver: chatWithId,
      content: message,
      createdAt: new Date().toISOString()
    };

    socket.emit('private_message', msg);
    addMessage(chatWithId, msg);
    sendMessageMutation.mutate(
      { receiverId: chatWithId, content: message },
      {
        onSuccess: () => {
          refetch(); // 👈 OVO osvežava poruke iz API-ja
        }
      }
    );
    setMessage('');
  };

  const chatMessages = messages[chatWithId] || [];
  const isInDialog = !!onClose;

  return (
    <Box
      sx={{
        position: isInDialog ? 'relative' : 'fixed',
        bottom: isInDialog ? 'auto' : 20,
        right: isInDialog ? 'auto' : (stylePosition?.right ?? 100) + index * 280,
        width: isInDialog ? '100%' : 280,
        height: isInDialog
          ? '100vh'
          : isMinimized
            ? 'auto'
            : 380,
        bgcolor: theme.palette.background.paper,
        border: isInDialog ? 'none' : `1px solid ${theme.palette.grey[300]}`,
        borderRadius: isInDialog ? 0 : 2,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isInDialog ? 'none' : `0 3px 12px ${theme.palette.grey[400]}`,
        zIndex: isInDialog ? 'auto' : 1400 + index,
        transition: 'height 0.25s ease-in-out',
        overflow: 'hidden',
        ...(isInDialog && { margin: 0 })
      }}
    >
      <Box
        sx={{
          p: 1.2,
          px: 1.6,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          fontWeight={600}
          fontSize={14}
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: 160
          }}
        >
          {userName}
        </Typography>

        <Box>
          {!isInDialog && (
            <Tooltip title={isMinimized ? 'Proširi' : 'Minimizuj'}>
              <IconButton
                size="small"
                onClick={() => setIsMinimized((prev) => !prev)}
              >
                <MinimizeIcon
                  sx={{ color: theme.palette.secondary.contrastText }}
                />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Zatvori">
            <IconButton
              size="small"
              onClick={() => (onClose ? onClose() : closeChat(chatWithId))}
            >
              <CloseIcon sx={{ color: theme.palette.secondary.contrastText }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {(!isMinimized || isInDialog) && (
        <>
          <Box
            ref={chatBoxRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1.2,
              bgcolor: theme.palette.background.main,
              backgroundImage:
                'linear-gradient(180deg, #FDFFFB 0%, #F9FCF7 100%)'
            }}
          >
            {isLoading && (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Učitavanje...
              </Typography>
            )}
            {chatMessages.slice(-visibleCount).map((msg, i) => {
              const isMe = msg.sender === currentUser;
              return (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    mb: 0.8
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: isMe
                        ? theme.palette.primary.main
                        : theme.palette.success.light,
                      color: isMe
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      fontSize: 13,
                      wordBreak: 'break-word',
                      boxShadow: isMe
                        ? '0 1px 3px rgba(0,0,0,0.1)'
                        : '0 1px 2px rgba(0,0,0,0.08)'
                    }}
                  >
                    {msg.content}
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              p: 1,
              borderTop: `1px solid ${theme.palette.grey[200]}`,
              bgcolor: theme.palette.background.paper
            }}
          >
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Poruka..."
              size="small"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.grey[50],
                  '& fieldset': { borderColor: theme.palette.grey[300] },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              sx={{
                ml: 0.8,
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 600,
                px: 2.5,
                textTransform: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Pošalji
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chat;
