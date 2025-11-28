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
  InputAdornment
} from '@mui/material';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { MessageCircle, Search, Send } from 'lucide-react';
import { useState, useContext, useEffect, useRef, useMemo } from 'react';

export const Message = () => {
  const { data, isLoading, error } = useUserMessage();
  const conversations = data?.data ?? [];
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
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

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv: any) =>
    (conv.otherUserName || 'Nepoznat korisnik')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Get selected conversation
  const selectedConversation = useMemo(
    () => (selectedUserId ? messages[selectedUserId] || [] : []),
    [selectedUserId, messages]
  );

  // Load conversation messages from API
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

  // Scroll to bottom when new messages arrive
  const prevMessageCountRef = useRef<number>(0);
  const prevSelectedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset count when switching to a different user
    if (prevSelectedUserIdRef.current !== selectedUserId) {
      prevMessageCountRef.current = 0;
      prevSelectedUserIdRef.current = selectedUserId;
    }

    if (messagesEndRef.current && selectedUserId) {
      const currentCount = selectedConversation.length;
      // Only scroll if new messages were actually added (count increased)
      if (currentCount > prevMessageCountRef.current && currentCount > 0) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      prevMessageCountRef.current = currentCount;
    }
  }, [selectedConversation.length, selectedUserId, selectedConversation]);

  // Mark as read when conversation is selected
  useEffect(() => {
    if (selectedUserId && alreadyMarked.current !== selectedUserId) {
      markAsRead.mutate(selectedUserId);
      alreadyMarked.current = selectedUserId;
    }
  }, [selectedUserId, markAsRead]);

  // Handle socket messages
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
  }, [socket, selectedUserId, addMessage]);

  const handleUserClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || 'Nepoznat korisnik');
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

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getSelectedUserEmail = () => {
    const conv = conversations.find(
      (c: any) => c.otherUserId === selectedUserId
    );
    return conv?.otherUserEmail || '';
  };

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={pageTitle} />

      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'flex',
          'flex-col',
          'md:flex-row'
        )}
      >
        {/* Left Sidebar - Conversations List */}
        <div
          className={clsx(
            'bg-white border-r border-b border-gray-200 flex flex-col',
            isMobileOrTablet ? 'w-full' : 'w-120'
          )}
        >
          {/* Header */}
          <div className="mr-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h1
                className={clsx(
                  'text-4xl font-bold text-forestGreen font-ephesis mt-4'
                )}
              >
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

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto mt-4">
            {isLoading && (
              <div className="flex justify-center items-center">
                <CircularProgress style={{ fontSize: 24 }} />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center">
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

            {filteredConversations.map((conv: any) => {
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
                  className={clsx(
                    'w-full px-4 py-3 border-b border-gray-200 flex items-center gap-3 transition-colors',
                    isSelected ? 'bg-teaGreen' : 'hover:bg-gray-50'
                  )}
                  style={{ outline: 'none' }}
                >
                  <Badge
                    badgeContent={
                      conv.unreadCount > 0 ? conv.unreadCount : null
                    }
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
                      className={clsx(
                        'font-semibold text-sm truncate',
                        conv.unreadCount > 0
                          ? 'text-forestGreen'
                          : 'text-gray-700'
                      )}
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

        {/* Right Side - Chat Area */}
        <div
          className={clsx(
            'flex-1 flex flex-col bg-whiteLinen h-[500px] md:h-auto'
          )}
        >
          {selectedUserId ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 bg-white pl-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={formatImageUrl(
                      conversations.find(
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
                      <p className="text-sm text-gray-500">
                        {getSelectedUserEmail()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <Box
                ref={chatBoxRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  py: 3,
                  pl: 3,
                  bgcolor: theme.palette.background.main,
                  backgroundImage:
                    'linear-gradient(180deg, #FDFFFB 0%, #F9FCF7 100%)'
                }}
              >
                {isConversationLoading && (
                  <div className="flex justify-center items-center py-10">
                    <CircularProgress style={{ fontSize: 24 }} />
                  </div>
                )}
                {selectedConversation.length === 0 &&
                  !isConversationLoading && (
                    <div className="text-center text-gray-500 py-10">
                      Nema poruka u ovoj konverzaciji.
                    </div>
                  )}
                {selectedConversation.map((msg, i) => {
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
                        <Typography
                          sx={{ fontSize: 14, wordBreak: 'break-word' }}
                        >
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

              {/* Message Input */}
              <div className="border-t border-gray-200 md:px-3 py-4">
                <div className="flex gap-4 items-center">
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
                    <Send />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center text-center">
                <MessageCircle className="mr-2" />
                <p className="text-gray-500 text-lg">
                  Odaberi korisnika da počneš razgovor
                </p>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
};
