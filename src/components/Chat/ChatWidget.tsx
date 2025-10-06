import React, { useState } from 'react';
import Chat from './Chat';

interface ChatWidgetProps {
  userId: string;
  chatWithId: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ userId, chatWithId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {/* Dugme za otvaranje/zatvaranje */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#0078FF',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          💬
        </button>
      ) : (
        <div
          style={{
            width: 320,
            height: 420,
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              backgroundColor: '#0078FF',
              color: '#fff',
              padding: '8px 12px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Chat</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}
            >
              ✖
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <Chat userId={userId} chatWithId={chatWithId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
