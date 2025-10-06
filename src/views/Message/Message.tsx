import { LoadingOutlined } from '@ant-design/icons';
import { BackButton } from '@green-world/components';
import Chat from '@green-world/components/Chat/Chat';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { Dialog, DialogContent } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const Message = ({ ...props }) => {
  const { data, isLoading, error } = useUserMessage();
  const conversations = data?.data ?? [];
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Poruke</title>
        <link rel="canonical" href="https://www.zelenisvet.rs/messages" />
      </Helmet>

      <div
        className={clsx(
          'xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-10 flex flex-col gap-7'
        )}
      >
        {/* Header */}
        <section
          className={clsx(
            'flex items-center w-full justify-center relative mb-4'
          )}
        >
          <div className={clsx('hidden md:flex absolute left-0')}>
            <BackButton />
          </div>
          <h1
            className={clsx(
              'text-forestGreen text-5xl md:text-6xl font-ephesis'
            )}
          >
            Poruke
          </h1>
        </section>

        {/* Konverzacije */}
        <section className="w-full flex flex-col gap-4">
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <LoadingOutlined style={{ fontSize: 24 }} />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center">
              Došlo je do greške prilikom učitavanja poruka.
            </div>
          )}

          {conversations.length === 0 && !isLoading && (
            <div className="text-center text-gray-500">
              Nemate nijednu konverzaciju.
            </div>
          )}

          {conversations.map((conv: any) => {
            const unreadCount = conv.unreadCount || 0;
            const lastMessageDate = conv.lastMessage?.createdAt
              ? new Date(conv.lastMessage.createdAt).toLocaleString()
              : '';

            return (
              <div
                key={conv.otherUserId}
                onClick={() => {
                  setActiveChatUserId(conv.otherUserId);
                  setIsChatOpen(true);
                }}
                className="border p-4 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
              >
                {/* Leva strana: ime i datum */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">
                    {conv.otherUserName || 'Nepoznat korisnik'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lastMessageDate}
                  </span>
                </div>

                {/* Sredina: poslednja poruka */}
                <div className="flex-1 px-4 text-gray-600 text-sm">
                  {conv.lastMessage?.content || 'Nema poruka'}
                </div>

                {/* Sredina: poslednja poruka */}
                <div className="flex-1 px-4 text-gray-600 text-sm">
                  {conv.unreadCount || 'Nema poruka'}
                </div>
                {/* Desna strana: broj nepročitanih */}
              </div>
            );
          })}
        </section>
        <Dialog
          open={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ style: { overflow: 'hidden' } }}
        >
          {activeChatUserId && (
            <Chat
              userId={props.userId}
              chatWithId={activeChatUserId} // ✅ sada prosleđuješ pravog korisnika
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </Dialog>
      </div>
    </div>
  );
};
