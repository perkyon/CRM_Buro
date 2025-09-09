import { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AddClientDialog } from '../dialogs/AddClientDialog';
import { AddProjectDialog } from '../dialogs/AddProjectDialog';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users,
  AlertTriangle,
  Factory,
  CheckCircle,
  MessageSquare,
  FolderOpen
} from 'lucide-react';

export function Dashboard() {
  const { dashboardStats, fetchDashboardStats, error } = useData();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Ошибка загрузки данных: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Проекты в работе',
      value: dashboardStats.activeProjects || 0,
      icon: TrendingUp,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Просроченные',
      value: dashboardStats.overdue || 0,
      icon: AlertTriangle,
      trend: '-2',
      trendUp: true,
      variant: 'warning' as const
    },
    {
      title: 'Ожидание предоплаты',
      value: dashboardStats.awaitingPayment || 0,
      icon: DollarSign,
      trend: '+5',
      trendUp: false,
      variant: 'secondary' as const
    },
    {
      title: 'Загрузка цеха',
      value: dashboardStats.productionLoad || 0,
      icon: Factory,
      trend: `${dashboardStats.productionLoad || 0}%`,
      trendUp: true,
      isPercentage: true
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'message',
      title: 'Новое сообщение от Петров И.В.',
      subtitle: 'Проект #2024-156: Кухонный гарнитур',
      time: '2 мин назад',
      status: 'new'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Получена предоплата 50%',
      subtitle: 'Проект #2024-155: Гардеробная система',
      time: '15 мин назад',
      status: 'success'
    },
    {
      id: '3',
      type: 'status',
      title: 'Статус изменен: В производстве',
      subtitle: 'Проект #2024-154: Обеденный стол',
      time: '1 час назад',
      status: 'info'
    },
    {
      id: '4',
      type: 'task',
      title: 'Завершена задача: Шлифовка',
      subtitle: 'Проект #2024-153: Книжный шкаф',
      time: '2 часа назад',
      status: 'success'
    },
    {
      id: '5',
      type: 'deadline',
      title: 'Приближается дедлайн',
      subtitle: 'Проект #2024-152: Спальный гарнитур',
      time: '3 часа назад',
      status: 'warning'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'payment': return DollarSign;
      case 'status': return TrendingUp;
      case 'task': return CheckCircle;
      case 'deadline': return Clock;
      default: return TrendingUp;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Дашборд</h1>
        <p className="text-muted-foreground">Обзор системы и текущих проектов</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl">
                      {stat.value}{stat.isPercentage ? '%' : ''}
                    </p>
                    <p className={`text-xs mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.variant === 'warning' ? 'bg-yellow-100' :
                    stat.variant === 'secondary' ? 'bg-gray-100' :
                    'bg-blue-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      stat.variant === 'warning' ? 'text-yellow-600' :
                      stat.variant === 'secondary' ? 'text-gray-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                </div>
                {stat.isPercentage && (
                  <div className="mt-4">
                    <Progress value={stat.value} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Последние события</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <AddClientDialog
                trigger={
                  <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <Users className="w-6 h-6 mb-2 text-blue-600" />
                    <p className="text-sm">Новый клиент</p>
                    <p className="text-xs text-muted-foreground">Добавить клиента</p>
                  </button>
                }
              />
              <AddProjectDialog
                trigger={
                  <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <TrendingUp className="w-6 h-6 mb-2 text-green-600" />
                    <p className="text-sm">Новый проект</p>
                    <p className="text-xs text-muted-foreground">Создать проект</p>
                  </button>
                }
              />
              
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <MessageSquare className="w-6 h-6 mb-2 text-purple-600" />
                <p className="text-sm">Omni-Inbox</p>
                <p className="text-xs text-muted-foreground">3 новых сообщения</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left" onClick={() => alert('Omni-Inbox!')}>
                <MessageSquare className="w-6 h-6 mb-2 text-purple-600" />
                <p className="text-sm">Omni-Inbox</p>
                <p className="text-xs text-muted-foreground">3 новых сообщения</p>
              </button>
              
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <DollarSign className="w-6 h-6 mb-2 text-yellow-600" />
                <p className="text-sm">Финансы</p>
                <p className="text-xs text-muted-foreground">Отчеты и платежи</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left" onClick={() => alert('Финансы!')}>
                <DollarSign className="w-6 h-6 mb-2 text-yellow-600" />
                <p className="text-sm">Финансы</p>
                <p className="text-xs text-muted-foreground">Отчеты и платежи</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}