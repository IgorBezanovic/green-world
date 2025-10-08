import ChatComponent from '@green-world/components/Chat/Chat';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { getItem } from '@green-world/utils/cookie';
import { Chat } from '@mui/icons-material';
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Typography,
  Dialog,
  DialogContent
} from '@mui/material';
import { useState } from 'react';

export const ChatLine = () => {
  const { data, isLoading, error, refetch } = useUserMessage();
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const token = getItem('token');

  if (!token) return null;

  const messages = data?.data?.slice(-5) ?? [];

  const handleOpenChat = (userId: string) => {
    setActiveChatUserId(userId);
    setIsChatOpen(true);
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}>
        <SpeedDial
          ariaLabel="Poslednje poruke"
          icon={<SpeedDialIcon icon={<Chat />} />}
          direction="up"
          open={open}
          onOpen={() => {
            setOpen(true);
            refetch();
          }}
          onClose={() => setOpen(false)}
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
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'center',
                        lineHeight: 1.1,
                        color: 'white'
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
                          top: 4,
                          right: 4,
                          backgroundColor: 'red',
                          color: 'white',
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
                    width: 60,
                    height: 60,
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#115293' }
                  }
                }}
                tooltipTitle={
                  <div style={{ maxWidth: 220, whiteSpace: 'normal' }}>
                    {msg.lastMessage?.content ||
                      msg.content ||
                      'Nema sadržaja poruke'}
                  </div>
                }
                onClick={() => handleOpenChat(msg.otherUserId)}
              />
            ))}

          {!isLoading && !error && messages.length === 0 && (
            <SpeedDialAction
              key="empty"
              icon={
                <Typography sx={{ fontSize: 11, textAlign: 'center', px: 1 }}>
                  Nema
                </Typography>
              }
              tooltipTitle="Nema dostupnih poruka"
            />
          )}
        </SpeedDial>
      </div>

      <Dialog
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {activeChatUserId && (
            <ChatComponent
              chatWithId={activeChatUserId}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
