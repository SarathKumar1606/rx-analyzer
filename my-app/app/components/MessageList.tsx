// 'use client';

// import { useEffect, useRef } from 'react';
// import type { UIMessage } from 'ai';
// import ChatMessage from './ChatMessage';

// export default function MessageList({ messages }: { messages: UIMessage[] }) {
//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
//         Start a conversation
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-3">
//       {messages.map(m => (
//         <ChatMessage key={m.id} message={m} />
//       ))}
//       <div ref={endRef} />
//     </div>
//   );
// }
'use client';

import { useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list flex items-center justify-center text-muted text-sm">
        <div className="text-center muted">Upload a prescription and start analysis</div>
      </div>
    );
  }

  return (
    <div className="message-list flex flex-col">
      {messages.map((m, index) => (
        <div
          key={index}
          className={`max-w-[75%] p-3 rounded-lg ${m.role === 'user' ? 'msg-user self-end ml-auto' : 'msg-assistant self-start'}`}
        >
          <p className="whitespace-pre-wrap">{m.content}</p>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}