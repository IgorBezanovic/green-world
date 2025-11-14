import Chat from '@green-world/components/Chat/Chat';
import { ChatContext } from '@green-world/context/ChatContext';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { getItem } from '@green-world/utils/cookie';
import { Chat as ChatIcon } from '@mui/icons-material';
import {
  SpeedDial,
  SpeedDialAction,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState, useContext } from 'react';

export const ChatLine = () => {
  const { data, isLoading, error, refetch } = useUserMessage();
  const token = getItem('token');
  const [open, setOpen] = useState(false);

  const { openChat, openChats } = useContext(ChatContext);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!token) return null;

  // Prikazuj ChatLine samo na desktop uređajima
  if (!isDesktop) return null;

  const messages = data?.data?.slice(-5) ?? [];

  return (
    <>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1200 }}>
        <SpeedDial
          ariaLabel="Poslednje poruke"
          icon={<ChatIcon />}
          direction="up"
          open={open}
          onOpen={() => {
            setOpen(true);
            refetch();
          }}
          onClose={() => setOpen(false)}
          FabProps={{
            sx: {
              width: 64,
              height: 64,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              },
              boxShadow: `0 3px 8px ${theme.palette.grey[400]}`,
              borderRadius: '50%'
            }
          }}
        >
          {isLoading && (
            <SpeedDialAction
              key="loading"
              icon={<Typography sx={{ fontSize: 12 }}>...</Typography>}
              tooltipTitle="Učitavanje..."
            />
          )}

          {error && (
            <SpeedDialAction
              key="error"
              icon={<Typography sx={{ fontSize: 11 }}>Greška</Typography>}
              tooltipTitle="Greška pri učitavanju poruka"
            />
          )}

          {!isLoading &&
            !error &&
            messages.length > 0 &&
            messages.map((msg: any, index: number) => (
              <SpeedDialAction
                key={index}
                icon={
                  <div
                    style={{
                      position: 'relative',
                      width: 64,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: theme.palette.secondary.main
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'center',
                        lineHeight: 1.1,
                        color: theme.palette.primary.contrastText
                      }}
                    >
                      {msg.otherUserName?.length > 8
                        ? msg.otherUserName.slice(0, 8) + '…'
                        : msg.otherUserName || 'Nepoznato'}
                    </Typography>

                    {msg.unreadCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: theme.palette.error.main,
                          color: theme.palette.error.contrastText,
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 'bold',
                          boxShadow: `0 0 3px ${theme.palette.grey[600]}`
                        }}
                      >
                        {msg.unreadCount}
                      </div>
                    )}
                  </div>
                }
                FabProps={{
                  sx: {
                    width: 64,
                    height: 64,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    boxShadow: `0 3px 8px ${theme.palette.grey[400]}`
                  }
                }}
                onClick={() => openChat(msg.otherUserId, msg.otherUserName)}
              />
            ))}

          {!isLoading && !error && messages.length === 0 && (
            <SpeedDialAction
              key="empty"
              icon={
                <Typography
                  sx={{
                    fontSize: 11,
                    textAlign: 'center',
                    px: 1,
                    color: theme.palette.text.secondary
                  }}
                >
                  Nema
                </Typography>
              }
              tooltipTitle="Nema dostupnih poruka"
            />
          )}
        </SpeedDial>
      </div>

      {openChats.map((chat, index) => (
        <Chat
          key={chat.userId}
          chatWithId={chat.userId}
          userName={chat.userName}
          stylePosition={{ right: 100 + index }}
          index={index}
        />
      ))}
    </>
  );
};
