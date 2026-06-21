'use client';

import type { UIMessage } from 'ai';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';

  const text = message.parts
    .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
    .map(p => p.text)
    .join('');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}> 
      <div className={`max-w-[80%] px-4 py-3 rounded-lg text-sm leading-relaxed ${isUser ? 'msg-user' : 'msg-assistant'}`}>
        {isUser ? (
          <div className="whitespace-pre-wrap">{text}</div>
        ) : (
          <div className="whitespace-pre-wrap">
            <MarkdownPreview source={text} style={{ background: 'transparent', padding: 0 }} />
          </div>
        )}
      </div>
    </div>
  );
}
