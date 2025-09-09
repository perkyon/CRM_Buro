import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ClientDetailsDialog } from './ClientDetailsDialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare,
  Filter,
  User
} from 'lucide-react';

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: '1',
      name: 'Петров Иван Васильевич',
      company: null,
      contacts: [
        { type: 'phone', value: '+7 (495) 123-45-67' },
        { type: 'email', value: 'petrov@example.com' },
        { type: 'telegram', value: '@petrov_iv' }
      ],
      activeProjects: 1,
      manager: 'Анна Иванова',
      lastContact: '2024-09-03T14:32:00',
      tags: ['VIP']
    },
    {
      id: '2',
      name: 'ООО "Офис Комфорт"',
      company: 'ООО "Офис Комфорт"',
      contacts: [
        { type: 'phone', value: '+7 (495) 987-65-43' },
        { type: 'email', value: 'office@comfort.ru' }
      ],
      activeProjects: 2,
      manager: 'Михаил Петров',
      lastContact: '2024-09-03T13:15:00',
      tags: ['Корпоративный']
    },
    {
      id: '3',
      name: 'Сидорова Мария Александровна',
      company: null,
      contacts: [
        { type: 'phone', value: '+7 (495) 555-12-34' },
        { type: 'whatsapp', value: '+7 (495) 555-12-34' }
      ],
      activeProjects: 1,
      manager: 'Анна Иванова',
      lastContact: '2024-09-03T12:45:00',
      tags: []
    },
    {
      id: '4',
      name: 'Козлов Сергей Петрович',
      company: null,
      contacts: [
        { type: 'phone', value: '+7 (495) 777-88-99' },
        { type: 'email', value: 'kozlov@mail.ru' }
      ],
      activeProjects: 0,
      manager: 'Михаил Петров',
      lastContact: '2024-09-02T16:20:00',
      tags: ['Потенциальный']
    }
  ];

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'telegram': return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp': return <Phone className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatLastContact = (date: string) => {
    const now = new Date();
    const contactDate = new Date(date);
    const diffHours = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Только что';
    if (diffHours < 24) return `${diffHours} ч назад`;
    return contactDate.toLocaleDateString('ru-RU');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Клиенты</h1>
          <p className="text-muted-foreground">Управление базой клиентов</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск клиентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список клиентов ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Клиент</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead className="text-center">Активные проекты</TableHead>
                <TableHead>Ответственный</TableHead>
                <TableHead>Последний контакт</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <ClientDetailsDialog
                  client={{
                    name: client.name,
                    company: client.company || '',
                    taxId: '',
                    notes: '',
                    contacts: client.contacts.map(c => ({ kind: c.type, value: c.value, isPrimary: false })),
                    tags: client.tags || []
                  }}
                  trigger={
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {getInitials(client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            {client.company && (
                              <p className="text-sm text-muted-foreground">{client.company}</p>
                            )}
                            <div className="flex gap-1 mt-1">
                              {client.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {client.contacts.slice(0, 3).map((contact, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-sm text-muted-foreground"
                              title={contact.value}
                            >
                              {getContactIcon(contact.type)}
                            </div>
                          ))}
                          {client.contacts.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{client.contacts.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={client.activeProjects > 0 ? "default" : "secondary"}>
                          {client.activeProjects}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(client.manager)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{client.manager}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatLastContact(client.lastContact)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  }
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredClients.length === 0 && searchQuery && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg mb-2">Клиенты не найдены</h3>
            <p className="text-muted-foreground mb-4">
              Попробуйте изменить поисковый запрос или сбросить фильтры
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Сбросить поиск
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}