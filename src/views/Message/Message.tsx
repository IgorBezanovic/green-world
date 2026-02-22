import { MetaTags } from '@green-world/components';
import { ChatContext, Message as Msg } from '@green-world/context/ChatContext';
import { useConversation } from '@green-world/hooks/useConversation';
import { useMarkAsRead } from '@green-world/hooks/useMarkAsRead';
import { useSendMessage } from '@green-world/hooks/useSendMessage';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { getItem } from '@green-world/utils/cookie';
import { formatImageUrl } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import {
  CircularProgress,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  Badge,
  InputAdornment,
  IconButton
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { MessageCircle, Search, Send, ArrowLeft } from 'lucide-react';
import { useState, useContext, useEffect, useRef, useMemo } from 'react';

export const Message = () => {
  const { data, isLoading, error } = useUserMessage();
  const [localConversations, setLocalConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const pageTitle = `Zeleni svet | Poruke`;
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { socket, addMessage, messages } = useContext(ChatContext);
  const {
    data: conversationData,
    isLoading: isConversationLoading,
    refetch
  } = useConversation(selectedUserId || '');
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkAsRead();
  const alreadyMarked = useRef<string | null>(null);
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const currentUser = decodedToken?._id;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const next = data?.data ?? [];
    setLocalConversations(next);
  }, [data?.data]);

  const filteredConversations = localConversations.filter((conv: any) =>
    (conv.otherUserName || 'Nepoznat korisnik')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const selectedConversation = useMemo(
    () => (selectedUserId ? messages[selectedUserId] || [] : []),
    [selectedUserId, messages]
  );

  const visibleMessages = useMemo(() => {
    const total = selectedConversation.length;
    const count = Math.min(visibleCount, total);
    const start = Math.max(0, total - count);
    return selectedConversation.slice(start);
  }, [selectedConversation, visibleCount]);

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedUserId]);

  useEffect(() => {
    if (
      conversationData?.success &&
      Array.isArray(conversationData.data) &&
      selectedUserId
    ) {
      const existing = messages[selectedUserId] || [];
      const newMessages = conversationData.data.filter(
        (apiMsg: Msg) => !existing.some((m: Msg) => m._id === apiMsg._id)
      );
      if (newMessages.length > 0) {
        newMessages.forEach((msg: Msg) => {
          const duplicate = existing.some(
            (m: Msg) =>
              m.content === msg.content &&
              Math.abs(
                new Date(m.createdAt || '').getTime() -
                  new Date(msg.createdAt || '').getTime()
              ) < 3000
          );
          if (!duplicate) addMessage(selectedUserId, msg);
        });
      }
    }
  }, [conversationData, messages, selectedUserId, addMessage]);

  const prevMessageCountRef = useRef<number>(0);
  const prevSelectedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevSelectedUserIdRef.current !== selectedUserId) {
      prevMessageCountRef.current = 0;
      prevSelectedUserIdRef.current = selectedUserId;
    }

    const el = chatBoxRef.current;
    if (!el || !selectedUserId) return;

    const currentCount = selectedConversation.length;

    if (currentCount > prevMessageCountRef.current && currentCount > 0) {
      setTimeout(() => {
        if (!chatBoxRef.current) return;
        chatBoxRef.current.scrollTo({
          top: chatBoxRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }

    prevMessageCountRef.current = currentCount;
  }, [selectedConversation.length, selectedUserId]);

  useEffect(() => {
    if (selectedUserId && alreadyMarked.current !== selectedUserId) {
      markAsRead.mutate(selectedUserId);
      alreadyMarked.current = selectedUserId;
    }
  }, [selectedUserId, markAsRead]);

  useEffect(() => {
    if (!socket || !selectedUserId) return;

    const handleReceiveMessage = (msg: Msg) => {
      if (msg.sender === selectedUserId || msg.receiver === selectedUserId) {
        addMessage(selectedUserId, msg);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, selectedUserId, addMessage, currentUser]);

  const handleUserClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'Nepoznat korisnik');

    setLocalConversations((prev) =>
      prev.map((conv: any) =>
        conv.otherUserId === userId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleMobileBack = () => {
    setSelectedUserId(null);
    setSelectedUserName('');
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !selectedUserId) return;

    const msg: Msg = {
      sender: currentUser!,
      receiver: selectedUserId,
      content: messageInput,
      createdAt: new Date().toISOString()
    };

    socket.emit('private_message', msg);
    addMessage(selectedUserId, msg);
    sendMessageMutation.mutate(
      { receiverId: selectedUserId, content: messageInput },
      {
        onSuccess: () => {
          refetch();
        }
      }
    );
    setMessageInput('');
  };

  const handleScroll = () => {
    if (!chatBoxRef.current) return;

    const { scrollTop } = chatBoxRef.current;

    if (scrollTop === 0 && visibleCount < selectedConversation.length) {
      setVisibleCount((prev) =>
        Math.min(prev + 10, selectedConversation.length)
      );
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getSelectedUserEmail = () => {
    const conv = localConversations.find(
      (c: any) => c.otherUserId === selectedUserId
    );
    return conv?.otherUserEmail || '';
  };

  const renderConversationList = () => (
    <div
      className={`bg-white border-r border-b border-gray-200 flex flex-col ${
        isMobileOrTablet ? 'w-full' : 'w-1/3'
      }`}
    >
      <div className="mr-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-forestGreen font-ephesis mt-4">
            Poruke
          </h1>
        </div>
        <TextField
          placeholder="Pretraži korisnike..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          className="w-full"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4" />
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.grey[50],
              '& fieldset': { borderColor: theme.palette.grey[300] },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main
              }
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center">
            <CircularProgress style={{ fontSize: 24 }} />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center my-4">
            Došlo je do greške prilikom učitavanja poruka.
          </div>
        )}

        {!isLoading && filteredConversations.length === 0 && (
          <div className="my-4 text-gray-500">
            {searchQuery
              ? 'Nema rezultata pretrage.'
              : 'Nemate nijednu konverzaciju.'}
          </div>
        )}

        {filteredConversations?.map((conv: any) => {
          const isSelected = conv.otherUserId === selectedUserId;
          const lastMessageDate = conv.lastMessage?.createdAt
            ? new Date(conv.lastMessage.createdAt).toLocaleString('sr-RS', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
              })
            : '';

          return (
            <button
              key={conv.otherUserId}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUserClick(conv.otherUserId, conv.otherUserName);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              className={`my-1 w-full px-4 py-3 border-b border-gray-200 flex items-center gap-3 transition-colors ${
                isSelected ? 'bg-teaGreen' : 'hover:bg-gray-50'
              }`}
              style={{ outline: 'none' }}
            >
              <Badge
                badgeContent={conv.unreadCount > 0 ? conv.unreadCount : null}
                color="error"
                overlap="circular"
              >
                <Avatar
                  src={formatImageUrl(conv.otherUserProfileImage || '', 85)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  {getInitials(conv.otherUserName || 'Nepoznat korisnik')}
                </Avatar>
              </Badge>
              <div className="flex-1 text-left min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${
                    conv.unreadCount > 0 ? 'text-forestGreen' : 'text-gray-700'
                  }`}
                >
                  {conv.otherUserName || 'Nepoznat korisnik'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage?.content || 'Nema poruka'}
                  </p>
                  {lastMessageDate && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      • {lastMessageDate}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderChatContent = () => (
    <>
      <div className="border-b border-gray-200 bg-white pl-4 pr-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobileOrTablet && (
            <IconButton
              onClick={handleMobileBack}
              aria-label="Nazad na listu poruka"
            >
              <ArrowLeft className="w-5 h-5" />
            </IconButton>
          )}
          <Avatar
            src={formatImageUrl(
              localConversations.find(
                (c: any) => c.otherUserId === selectedUserId
              )?.otherUserProfileImage || '',
              85
            )}
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {getInitials(selectedUserName)}
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-forestGreen">
              {selectedUserName}
            </h2>
            {getSelectedUserEmail() && (
              <p className="text-sm text-gray-500">{getSelectedUserEmail()}</p>
            )}
          </div>
        </div>
      </div>

      <Box
        ref={chatBoxRef}
        onScroll={handleScroll}
        sx={{
          height: isMobileOrTablet ? 'calc(100vh - 80px - 72px)' : 690,
          overflowY: 'auto',
          py: 3,
          pl: 3,
          pr: 2,
          bgcolor: theme.palette.background.main,
          backgroundImage: 'linear-gradient(180deg, #FDFFFB 0%, #F9FCF7 100%)'
        }}
      >
        {isConversationLoading && (
          <div className="flex justify-center items-center py-10">
            <CircularProgress style={{ fontSize: 24 }} />
          </div>
        )}
        {selectedConversation.length === 0 && !isConversationLoading && (
          <div className="text-center text-gray-500 py-10">
            Nema poruka u ovoj konverzaciji.
          </div>
        )}
        {visibleMessages?.map((msg, i) => {
          const isMe = msg.sender === currentUser;
          const messageTime = msg.createdAt
            ? new Date(msg.createdAt).toLocaleString('sr-RS', {
                hour: '2-digit',
                minute: '2-digit'
              })
            : '';

          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  maxWidth: '75%',
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: isMe
                    ? theme.palette.primary.main
                    : theme.palette.success.light,
                  color: isMe
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  fontSize: 14,
                  wordBreak: 'break-word',
                  boxShadow: isMe
                    ? '0 1px 3px rgba(0,0,0,0.1)'
                    : '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                <Typography sx={{ fontSize: 14, wordBreak: 'break-word' }}>
                  {msg.content}
                </Typography>
                {messageTime && (
                  <Typography
                    sx={{
                      fontSize: 10,
                      opacity: 0.75,
                      mt: 0.5,
                      textAlign: isMe ? 'right' : 'left'
                    }}
                  >
                    {messageTime}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <div className="border-t border-gray-200 md:px-3 py-4">
        <div className="flex gap-4 items-center px-3 md:px-0">
          <TextField
            placeholder="Upiši poruku..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
            className="flex-1"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.grey[50],
                fontSize: 14
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{
              borderRadius: 1,
              minWidth: 40,
              width: 40,
              height: 40,
              px: 2,
              textTransform: 'none'
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  const renderChatArea = () => (
    <div
      className={`flex flex-col bg-whiteLinen ${
        isMobileOrTablet ? 'w-full' : 'w-2/3 h-[500px] md:h-auto'
      }`}
    >
      {selectedUserId
        ? renderChatContent()
        : !isMobileOrTablet && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center textcenter">
                <MessageCircle className="mr-2" />
                <p className="text-gray-500 text-lg">
                  Odaberi korisnika da počneš razgovor
                </p>
              </div>
            </div>
          )}
    </div>
  );

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={pageTitle} />

      <Box className="xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 flex flex-col md:flex-row">
        {!isMobileOrTablet && (
          <>
            {renderConversationList()}
            {renderChatArea()}
          </>
        )}

        {isMobileOrTablet && !selectedUserId && renderConversationList()}
      </Box>

      {isMobileOrTablet && selectedUserId && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: theme.zIndex.modal + 1,
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {renderChatContent()}
        </Box>
      )}
    </Box>
  );
};
