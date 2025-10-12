import { MetaTags } from '@green-world/components';
import Chat from '@green-world/components/Chat/Chat';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { CircularProgress } from '@mui/material';
import { Dialog } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';

export const Message = () => {
  const { data, isLoading, error } = useUserMessage();
  const conversations = data?.data ?? [];
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const pageTitle = `Zeleni svet | Poruke`;

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={pageTitle} />

      <div
        className={clsx(
          'xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-10 flex flex-col gap-7'
        )}
      >
        <section
          className={clsx(
            'flex items-center w-full justify-center relative mb-4'
          )}
        >
          <h1
            className={clsx(
              'text-forestGreen text-5xl md:text-6xl font-ephesis'
            )}
          >
            Poruke
          </h1>
        </section>

        <section className="w-full flex flex-col gap-4">
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <CircularProgress style={{ fontSize: 24 }} />
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
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">
                    {conv.otherUserName || 'Nepoznat korisnik'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lastMessageDate}
                  </span>
                </div>

                <div className="flex-1 px-4 text-gray-600 text-sm">
                  {conv.lastMessage?.content || 'Nema poruka'}
                </div>

                <div className="flex-1 px-4 text-gray-600 text-sm">
                  {conv.unreadCount || 'Nema novih poruka'}
                </div>
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
              chatWithId={activeChatUserId}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </Dialog>
      </div>
    </div>
  );
};
