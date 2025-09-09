import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Paperclip, 
  Send,
  MoreHorizontal,
  AlertCircle,
  User,
  FolderOpen,
  DollarSign
} from 'lucide-react';

export function OmniInbox() {
  const [selectedThread, setSelectedThread] = useState<string>('1');
  const [messageText, setMessageText] = useState('');

  const folders = [
    { id: 'inbox', label: 'Входящие', count: 12 },
    { id: 'sla', label: 'SLA!', count: 3, urgent: true },
    { id: 'in_progress', label: 'В работе', count: 8 },
    { id: 'waiting_client', label: 'Ждут клиента', count: 5 },
    { id: 'closed', label: 'Закрытые', count: 0 }
  ];

  const threads = [
    {
      id: '1',
      clientName: 'Петров Иван Васильевич',
      channel: 'telegram' as const,
      lastMessage: 'Здравствуйте! Интересует изготовление кухонного гарнитура.',
      lastMessageTime: '14:32',
      unread: true,
      slaBreached: false,
      projectId: '2024-156'
    },
    {
      id: '2',
      clientName: 'ООО "Офис Комфорт"',
      channel: 'email' as const,
      lastMessage: 'Отправили КП на офисную мебель. Ждем ответа.',
      lastMessageTime: '13:15',
      unread: false,
      slaBreached: true,
      projectId: '2024-155'
    },
    {
      id: '3',
      clientName: 'Сидорова Мария',
      channel: 'whatsapp' as const,
      lastMessage: 'Можно ли изменить размеры шкафа?',
      lastMessageTime: '12:45',
      unread: true,
      slaBreached: false,
      projectId: '2024-154'
    }
  ];

  const messages = [
    {
      id: '1',
      direction: 'in' as const,
      body: 'Здравствуйте! Интересует изготовление кухонного гарнитура.',
      time: '14:30',
      isInternal: false
    },
    {
      id: '2',
      direction: 'out' as const,
      body: 'Здравствуйте! Будем рады помочь с кухонным гарнитуром. Для расчета нужны размеры помещения.',
      time: '14:31',
      isInternal: false
    },
    {
      id: '3',
      direction: 'in' as const,
      body: 'Размеры: 3.2м x 2.8м. Нужны верхние и нижние шкафы.',
      time: '14:32',
      isInternal: false
    },
    {
      id: '4',
      direction: 'internal' as const,
      body: '@примечание: клиент хочет МДФ, бюджет до 300к',
      time: '14:33',
      isInternal: true
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'telegram': return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'telegram': return 'text-blue-600';
      case 'whatsapp': return 'text-green-600';
      case 'email': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const currentThread = threads.find(t => t.id === selectedThread);
  const currentClient = currentThread ? { 
    name: currentThread.clientName,
    phone: '+7 (495) 123-45-67',
    email: 'petrov@example.com'
  } : null;

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here would be the logic to send message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Folders and Filters */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-4">
          <h2 className="text-lg mb-4">Omni-Inbox</h2>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                className={`w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-muted transition-colors ${
                  folder.id === 'inbox' ? 'bg-muted' : ''
                }`}
              >
                <span className={folder.urgent ? 'text-red-600' : ''}>{folder.label}</span>
                {folder.count > 0 && (
                  <Badge variant={folder.urgent ? 'destructive' : 'secondary'} className="text-xs">
                    {folder.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Panel - Thread List */}
      <div className="w-80 border-r border-border">
        <div className="p-4 border-b border-border">
          <Input placeholder="Поиск диалогов..." />
        </div>
        <div className="overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedThread === thread.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={getChannelColor(thread.channel)}>
                    {getChannelIcon(thread.channel)}
                  </div>
                  <h3 className="text-sm truncate">{thread.clientName}</h3>
                  {thread.slaBreached && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {thread.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  <span className="text-xs text-muted-foreground">{thread.lastMessageTime}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">
                {thread.lastMessage}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {thread.projectId}
                </Badge>
                {thread.slaBreached && (
                  <Badge variant="destructive" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    SLA
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Conversation and Client Info */}
      <div className="flex-1 flex">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {currentThread?.clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>{currentThread?.clientName}</h3>
                  <div className="flex items-center gap-2">
                    <div className={getChannelColor(currentThread?.channel || 'telegram')}>
                      {getChannelIcon(currentThread?.channel || 'telegram')}
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">
                      {currentThread?.channel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Отпр. КП</Button>
                <Button variant="outline" size="sm">Предоплата</Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'out' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isInternal 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : message.direction === 'out'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <p className={`text-xs mt-1 ${
                    message.direction === 'out' && !message.isInternal 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Введите сообщение..."
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">Шаблон</Button>
              <Button variant="outline" size="sm">КП</Button>
              <Button variant="outline" size="sm">Счет</Button>
            </div>
          </div>
        </div>

        {/* Side Panel - Client Info */}
        <div className="w-80 border-l border-border bg-muted/30">
          <div className="p-4 space-y-4">
            {/* Client Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Клиент
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm">{currentClient?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Телефон</p>
                  <p className="text-sm">{currentClient?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{currentClient?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Проект
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm">Кухонный гарнитур</p>
                  <Badge variant="outline">{currentThread?.projectId}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Этап</p>
                  <Badge>Лид</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Менеджер</p>
                  <p className="text-sm">Анна Иванова</p>
                </div>
              </CardContent>
            </Card>

            {/* Finance Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Финансы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Бюджет</p>
                  <p className="text-sm">300 000 ₽</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Предоплата</p>
                  <p className="text-sm text-muted-foreground">Не внесена</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}