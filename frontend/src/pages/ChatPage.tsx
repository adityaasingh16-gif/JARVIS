import React from 'react';
import { useJarvisStore } from '../stores/jarvisStore';
import { MessageFeed } from '../components/chat/MessageFeed';
import { InputArea } from '../components/chat/InputArea';

export const ChatPage: React.FC = () => {
  const { messages, isStreaming } = useJarvisStore();

  return (
    <div className="flex flex-col h-full bg-[#080C14]">
      <MessageFeed messages={messages} isStreaming={isStreaming} />
      <InputArea />
    </div>
  );
};
