'use client';

import { FormEvent } from 'react';

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="input-row white">
      <input
        className="text-input"
        value={input}
        onChange={e => setInput(e.currentTarget.value)}
        placeholder="Type a message or ask about the prescription..."
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading}
        className="send-btn"
      >
        {isLoading ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
