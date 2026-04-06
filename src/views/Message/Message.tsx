'use client';

import { MetaTags } from '@green-world/components';
import { ChatContext, Message as Msg } from '@green-world/context/ChatContext';
import UserContext from '@green-world/context/UserContext';
import { useConversation } from '@green-world/hooks/useConversation';
import { useMarkAsRead } from '@green-world/hooks/useMarkAsRead';
import { useSendMessage } from '@green-world/hooks/useSendMessage';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { formatImageUrl } from '@green-world/utils/helpers';
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
import { MessageCircle, Search, Send, ArrowLeft } from 'lucide-react';
import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const Message = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useUserMessage();
  const [localConversations, setLocalConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const pageTitle = t('seo.message.title');
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { userId } = useContext(UserContext);
  const { socket, addMessage, messages, markMessagesAsSeen } =
    useContext(ChatContext);
  const { data: conversationData, isLoading: isConversationLoading } =
    useConversation(selectedUserId || '');
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkAsRead();
  const alreadyMarked = useRef<string | null>(null);
  const currentUser = userId;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const next = data?.data ?? [];
    setLocalConversations(next);
  }, [data?.data]);

  const filteredConversations = localConversations.filter((conv: any) =>
    (conv.otherUserName || t('common.unknownUser'))
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
    if (!selectedUserId) return;

    setLocalConversations((prev) =>
      prev.map((conv: any) =>
        conv.otherUserId === selectedUserId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, [selectedUserId, messages]);

  useEffect(() => {
    if (!socket || !selectedUserId) return;

    const handleReceiveMessage = (msg: Msg) => {
      if (msg.sender === selectedUserId || msg.receiver === selectedUserId) {
        addMessage(selectedUserId, msg);

        if (msg.sender === selectedUserId) {
          markAsRead.mutate(selectedUserId);
          setLocalConversations((prev) =>
            prev.map((conv: any) =>
              conv.otherUserId === selectedUserId
                ? { ...conv, unreadCount: 0 }
                : conv
            )
          );
        }
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, selectedUserId, addMessage, currentUser, markAsRead]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleMessagesSeen = (payload: {
      chatWithId: string;
      readerId: string;
    }) => {
      if (!payload?.chatWithId || !payload?.readerId) return;

      markMessagesAsSeen(payload.chatWithId, currentUser);
    };

    socket.on('messages_seen', handleMessagesSeen);
    return () => {
      socket.off('messages_seen', handleMessagesSeen);
    };
  }, [socket, currentUser, markMessagesAsSeen]);

  const handleUserClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName || t('common.unknownUser'));

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
    if (!messageInput.trim() || !socket || !selectedUserId || !currentUser)
      return;

    const msg: Msg = {
      sender: currentUser!,
      receiver: selectedUserId,
      content: messageInput,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    socket.emit('private_message', msg);
    addMessage(selectedUserId, msg);
    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content: messageInput
    });
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

  const lastSeenOutgoingMessageIndex = useMemo(() => {
    if (!currentUser) return -1;

    for (let i = selectedConversation.length - 1; i >= 0; i -= 1) {
      const msg = selectedConversation[i];
      if (msg.sender === currentUser) {
        return msg.isRead ? i : -1;
      }
    }

    return -1;
  }, [selectedConversation, currentUser]);

  const renderConversationList = () => (
    <Box
      style={{
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        width: isMobileOrTablet ? '100%' : '33.333333%',
        height: '100%'
      }}
    >
      <Box style={{ marginRight: 24, borderBottom: '1px solid #e5e7eb' }}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}
        >
          <Typography
            component="h1"
            style={{
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: 700,
              color: '#3f7d58',
              fontFamily: 'Ephesis',
              marginTop: 16
            }}
          >
            {t('messageView.title')}
          </Typography>
        </Box>
        <TextField
          placeholder={t('messageView.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search style={{ width: 16, height: 16 }} />
                </InputAdornment>
              )
            }
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.grey[50],
              '& fieldset': { borderColor: theme.palette.grey[300] },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main
              }
            }
          }}
        />
      </Box>

      <Box style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress style={{ fontSize: 24 }} />
          </Box>
        )}

        {error && (
          <Typography
            component="p"
            style={{ color: '#ef4444', textAlign: 'center', margin: '16px 0' }}
          >
            {t('messageView.errorLoading')}
          </Typography>
        )}

        {!isLoading && filteredConversations.length === 0 && (
          <Typography
            component="p"
            style={{ margin: '16px 0', color: '#6b7280' }}
          >
            {searchQuery
              ? t('messageView.noSearchResults')
              : t('messageView.noConversations')}
          </Typography>
        )}

        {filteredConversations?.map((conv: any) => {
          const isSelected = conv.otherUserId === selectedUserId;
          const lastMessageDate = conv.lastMessage?.createdAt
            ? new Date(conv.lastMessage.createdAt).toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
              })
            : '';

          return (
            <Box
              component="button"
              key={conv.otherUserId}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUserClick(conv.otherUserId, conv.otherUserName);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              style={{
                marginTop: 4,
                marginBottom: 4,
                width: '100%',
                border: 'none',
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 12,
                paddingBottom: 12,
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'background-color 150ms',
                backgroundColor: isSelected ? '#E9F4E5' : 'transparent',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
                  {getInitials(conv.otherUserName || t('common.unknownUser'))}
                </Avatar>
              </Badge>
              <Box style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: '20px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: conv.unreadCount > 0 ? '#3f7d58' : '#374151'
                  }}
                >
                  {conv.otherUserName || t('common.unknownUser')}
                </Typography>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 4
                  }}
                >
                  <Typography
                    component="p"
                    style={{
                      fontSize: 12,
                      lineHeight: '16px',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {conv.lastMessage?.content || t('messageView.noMessages')}
                  </Typography>
                  {lastMessageDate && (
                    <Typography
                      component="span"
                      style={{
                        fontSize: 12,
                        lineHeight: '16px',
                        color: '#9ca3af',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      • {lastMessageDate}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const renderChatContent = () => (
    <>
      <Box
        style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          paddingBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobileOrTablet && (
            <IconButton
              onClick={handleMobileBack}
              aria-label={t('messageView.backToList')}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
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
          <Box>
            <Typography
              component="h2"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#3f7d58'
              }}
            >
              {selectedUserName}
            </Typography>
            {getSelectedUserEmail() && (
              <Typography
                component="p"
                style={{ fontSize: '0.875rem', color: '#6b7280' }}
              >
                {getSelectedUserEmail()}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        ref={chatBoxRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          py: 3,
          pl: 3,
          pr: 2,
          bgcolor: 'background.main',
          backgroundImage: 'linear-gradient(180deg, #FDFFFB 0%, #F9FCF7 100%)'
        }}
      >
        {isConversationLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 40,
              paddingBottom: 40
            }}
          >
            <CircularProgress style={{ fontSize: 24 }} />
          </div>
        )}
        {selectedConversation.length === 0 && !isConversationLoading && (
          <div
            style={{
              textAlign: 'center',
              color: '#6b7280',
              paddingTop: 40,
              paddingBottom: 40
            }}
          >
            {t('messageView.emptyConversation')}
          </div>
        )}
        {visibleMessages?.map((msg, i) => {
          const isMe = msg.sender === currentUser;
          const absoluteIndex =
            selectedConversation.length - visibleMessages.length + i;
          const isSeenIndicatorMessage =
            isMe &&
            absoluteIndex === lastSeenOutgoingMessageIndex &&
            msg.isRead;
          const messageTime = msg.createdAt
            ? new Date(msg.createdAt).toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })
            : '';

          return (
            <Box
              key={msg._id || `${msg.sender}-${msg.createdAt || i}-${i}`}
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
                {isSeenIndicatorMessage && (
                  <Typography
                    sx={{
                      fontSize: 10,
                      opacity: 0.85,
                      mt: 0.25,
                      textAlign: 'right'
                    }}
                  >
                    {t('messageView.seen')}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
        <Box ref={messagesEndRef} />
      </Box>

      <Box
        style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: isMobileOrTablet ? 0 : 12,
          paddingRight: isMobileOrTablet ? 0 : 12
        }}
      >
        <Box
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            paddingLeft: isMobileOrTablet ? 12 : 0,
            paddingRight: isMobileOrTablet ? 12 : 0
          }}
        >
          <TextField
            placeholder={t('messageView.messageInputPlaceholder')}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
            sx={{
              flex: 1,
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
              minWidth: 45,
              width: 45,
              height: 45,
              p: 0,
              textTransform: 'none'
            }}
          >
            <Send
              style={{
                color: 'white',
                width: 18,
                height: 18,
                strokeWidth: 2
              }}
            />
          </Button>
        </Box>
      </Box>
    </>
  );

  const renderChatArea = () => (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDFDFC',
        width: isMobileOrTablet ? '100%' : '66.666667%',
        height: '100%',
        flex: 1,
        minHeight: 0
      }}
    >
      {selectedUserId
        ? renderChatContent()
        : !isMobileOrTablet && (
            <Box
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <MessageCircle style={{ marginRight: 8 }} />
                <Typography
                  component="p"
                  style={{ color: '#6b7280', fontSize: '1.125rem' }}
                >
                  {t('messageView.selectUserToStart')}
                </Typography>
              </Box>
            </Box>
          )}
    </Box>
  );

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          height: 'calc(100vh - 140px)'
        },
        [theme.breakpoints.up('md')]: {
          height: 'calc(100vh - 180px)'
        }
      })}
    >
      <MetaTags
        title={pageTitle}
        description={t('seo.message.description')}
        keywords={t('seo.message.keywords')}
      />

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          flex: 1,
          minHeight: 0, // 🔥 ključno
          mx: 'auto',
          px: '16px',
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.up('sm')]: {
            px: '24px'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          [theme.breakpoints.up('md')]: {
            flexDirection: 'row'
          }
        })}
      >
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
