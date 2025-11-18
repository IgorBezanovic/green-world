import Chat from '@green-world/components/Chat/Chat';
import { ChatContext } from '@green-world/context/ChatContext';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { getItem } from '@green-world/utils/cookie';
import {
  SpeedDial,
  SpeedDialAction,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Badge from '@mui/material/Badge';
import { MessagesSquare } from 'lucide-react';
import { useState, useContext } from 'react';

export const ChatLine = () => {
  const { data, isLoading, error, refetch } = useUserMessage();
  const token = getItem('token');
  const [open, setOpen] = useState(false);

  const { openChat, openChats } = useContext(ChatContext);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!token) return null;

  if (!isDesktop) return null;

  const messages = data?.data?.slice(-5) ?? [];

  const totalUnread = messages.reduce(
    (sum: number, msg: any) => sum + (msg.unreadCount || 0),
    0
  );

  return (
    <>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1200 }}>
        <SpeedDial
          ariaLabel="Poslednje poruke"
          icon={
            <Badge
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={totalUnread > 0 ? totalUnread : null}
              sx={{
                '& .MuiBadge-badge': {
                  top: -6,
                  right: -6
                }
              }}
            >
              <MessagesSquare className="icon !w-8 !h-8" />
            </Badge>
          }
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
                backgroundColor: theme.palette.secondary.dark,
                '& .icon': {
                  color: theme.palette.common.white
                }
              },
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
                      width: 40,
                      height: 40,
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
                        color: theme.palette.primary.contrastText,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 36
                      }}
                    >
                      {msg.otherUserName?.length > 5
                        ? msg.otherUserName.slice(0, 5) + '…'
                        : msg.otherUserName || 'Nepoznato'}
                    </Typography>

                    {msg.unreadCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          backgroundColor: theme.palette.error.main,
                          color: theme.palette.error.contrastText,
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 'bold'
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
                    minHeight: 64,
                    minWidth: 64,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    }
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
