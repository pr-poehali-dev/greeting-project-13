import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Анна Петрова",
    lastMessage: "Привет! Как дела?",
    time: "15:30",
    avatar: "AP",
    unread: 2,
    isOnline: true
  },
  {
    id: 2,
    name: "Команда проекта",
    lastMessage: "Встреча завтра в 10:00",
    time: "14:22",
    avatar: "КП",
    unread: 0,
    isOnline: false
  },
  {
    id: 3,
    name: "Михаил Иванов",
    lastMessage: "Отправил файлы",
    time: "13:45",
    avatar: "МИ",
    unread: 1,
    isOnline: true
  },
  {
    id: 4,
    name: "Елена Сидорова",
    lastMessage: "Спасибо за помощь!",
    time: "12:10",
    avatar: "ЕС",
    unread: 0,
    isOnline: false
  }
];

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Привет! Как дела?",
    time: "15:28",
    isOwn: false
  },
  {
    id: 2,
    text: "Привет! Всё отлично, спасибо. А у тебя как?",
    time: "15:29",
    isOwn: true
  },
  {
    id: 3,
    text: "Тоже хорошо! Работаю над новым проектом",
    time: "15:30",
    isOwn: false
  }
];

export default function Index() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar with chat list */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-slate-900">Сообщения</h1>
            <Button variant="ghost" size="sm">
              <Icon name="Plus" size={20} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Поиск чатов..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockChats.map((chat) => (
              <Card 
                key={chat.id}
                className={`mb-2 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : 'border-slate-100'
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-slate-500">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full min-w-[20px] text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {selectedChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{selectedChat.name}</h2>
                    <p className="text-sm text-slate-500">
                      {selectedChat.isOnline ? 'в сети' : 'был в сети недавно'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Phone" size={20} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Video" size={20} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreVertical" size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isOwn 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    className="pr-12 bg-slate-50 border-slate-200"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Icon name="Smile" size={18} />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Выберите чат</h3>
              <p className="text-slate-500">Выберите чат из списка, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}