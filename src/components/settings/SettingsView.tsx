import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Users, 
  Settings, 
  Bell, 
  MessageSquare, 
  Database,
  Shield,
  Palette,
  FileText
} from 'lucide-react';

export function SettingsView() {
  const settingsSections = [
    {
      id: 'users',
      title: 'Пользователи и роли',
      description: 'Управление пользователями системы',
      icon: Users,
      items: [
        { label: 'Всего пользователей', value: '8' },
        { label: 'Активных сессий', value: '3' },
        { label: 'Доступных ролей', value: '7' }
      ]
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      description: 'Настройка внешних сервисов',
      icon: MessageSquare,
      items: [
        { label: 'Telegram Bot', value: 'Активен', status: 'success' },
        { label: 'WhatsApp Cloud API', value: 'Настроить', status: 'warning' },
        { label: 'Email (SMTP/IMAP)', value: 'Активен', status: 'success' }
      ]
    },
    {
      id: 'notifications',
      title: 'Уведомления',
      description: 'SLA и автоматические оповещения',
      icon: Bell,
      items: [
        { label: 'SLA нарушения', value: 'Включено', toggle: true },
        { label: 'Дедлайны проектов', value: 'Включено', toggle: true },
        { label: 'Новые сообщения', value: 'Включено', toggle: true }
      ]
    },
    {
      id: 'security',
      title: 'Безопасность',
      description: 'Настройки безопасности и доступа',
      icon: Shield,
      items: [
        { label: '2FA включен', value: '3 из 8 пользователей' },
        { label: 'Последний бэкап', value: '2 часа назад' },
        { label: 'Аудит лог', value: 'Активен', status: 'success' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Настройки</h1>
        <p className="text-muted-foreground">Управление системой и конфигурацией</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Добавить пользователя</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span className="text-sm">Шаблоны сообщений</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Database className="w-6 h-6" />
              <span className="text-sm">Создать бэкап</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Palette className="w-6 h-6" />
              <span className="text-sm">Настройки темы</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          
          return (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${section.id}-${index}`} className="text-sm">
                        {item.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        {item.toggle ? (
                          <Switch id={`${section.id}-${index}`} defaultChecked />
                        ) : item.status ? (
                          <Badge className={getStatusColor(item.status)}>
                            {item.value}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">{item.value}</span>
                        )}
                      </div>
                    </div>
                    {index < section.items.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Настроить {section.title.toLowerCase()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о системе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Версия системы</h4>
              <p className="text-lg">WoodCraft CRM v1.0.0</p>
              <p className="text-sm text-muted-foreground">MVP Release</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">База данных</h4>
              <p className="text-lg">PostgreSQL 15</p>
              <p className="text-sm text-muted-foreground">1,234 записей</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Время работы</h4>
              <p className="text-lg">15 дней</p>
              <p className="text-sm text-muted-foreground">Последняя перезагрузка</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Последние изменения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Settings className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm">Обновлены права доступа для роли "Мастер"</p>
                <p className="text-xs text-muted-foreground">Администратор • 2 часа назад</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm">Настроена интеграция с Telegram Bot</p>
                <p className="text-xs text-muted-foreground">Администратор • 1 день назад</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Database className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm">Выполнен автоматический бэкап базы данных</p>
                <p className="text-xs text-muted-foreground">Система • 1 день назад</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}