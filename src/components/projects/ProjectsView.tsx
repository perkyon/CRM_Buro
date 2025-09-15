import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { ProjectDetailsDialog } from './ProjectDetailsDialog';
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
  Filter,
  FolderOpen,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { AddProjectDialog } from '../dialogs/AddProjectDialog';

export function ProjectsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusConfig = {
    lead: { label: 'Лид', color: 'bg-gray-100 text-gray-800' },
    measurement_assigned: { label: 'Назначен замер', color: 'bg-blue-100 text-blue-800' },
    measurement_received: { label: 'Замер получен', color: 'bg-blue-100 text-blue-800' },
    tech_project_kp: { label: 'ТехПроект/КП', color: 'bg-indigo-100 text-indigo-800' },
    awaiting_prepayment: { label: 'Ожидание предоплаты', color: 'bg-yellow-100 text-yellow-800' },
    to_production: { label: 'К производству', color: 'bg-cyan-100 text-cyan-800' },
    in_production: { label: 'В производстве', color: 'bg-blue-100 text-blue-800' },
    quality_check: { label: 'Приёмка', color: 'bg-purple-100 text-purple-800' },
    ready_for_delivery: { label: 'Готово к отгрузке', color: 'bg-green-100 text-green-800' },
    closed: { label: 'Закрыт', color: 'bg-emerald-100 text-emerald-800' },
  };

  const [projects, setProjects] = useState<any[]>([
    {
      id: '2024-156',
      title: 'Кухонный гарнитур',
      clientName: 'Петров Иван Васильевич',
      status: 'lead' as const,
      manager: 'Анна Иванова',
      deadline: '2024-10-15',
      budget: 300000,
      prepayment: 0,
      remaining: 300000,
      progress: 10,
      createdAt: '2024-09-03'
    },
    {
      id: '2024-155',
      title: 'Офисная мебель',
      clientName: 'ООО "Офис Комфорт"',
      status: 'awaiting_prepayment' as const,
      manager: 'Михаил Петров',
      deadline: '2024-09-20',
      budget: 850000,
      prepayment: 0,
      remaining: 850000,
      progress: 45,
      createdAt: '2024-08-28'
    },
    {
      id: '2024-154',
      title: 'Гардеробная система',
      clientName: 'Сидорова Мария',
      status: 'in_production' as const,
      manager: 'Анна Иванова',
      deadline: '2024-09-25',
      budget: 180000,
      prepayment: 90000,
      remaining: 90000,
      progress: 75,
      createdAt: '2024-08-20'
    },
    {
      id: '2024-153',
      title: 'Обеденный стол и стулья',
      clientName: 'Козлов Сергей',
      status: 'quality_check' as const,
      manager: 'Михаил Петров',
      deadline: '2024-09-10',
      budget: 120000,
      prepayment: 60000,
      remaining: 60000,
      progress: 95,
      createdAt: '2024-08-15'
    },
    {
      id: '2024-152',
      title: 'Спальный гарнитур',
      clientName: 'Волкова Елена',
      status: 'closed' as const,
      manager: 'Анна Иванова',
      deadline: '2024-08-30',
      budget: 450000,
      prepayment: 450000,
      remaining: 0,
      progress: 100,
      createdAt: '2024-07-10'
    }
  ]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const isOverdue = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Проекты</h1>
          <p className="text-muted-foreground">Управление проектами и заказами</p>
        </div>
        <AddProjectDialog
          onSuccess={(p: any) => setProjects(prev => [p, ...prev])}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Новый проект
            </Button>
          }
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Всего проектов</p>
                <p className="text-xl">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">В работе</p>
                <p className="text-xl">
                  {projects.filter(p => !['closed'].includes(p.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Просрочено</p>
                <p className="text-xl">
                  {projects.filter(p => isOverdue(p.deadline) && !['closed'].includes(p.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Общий бюджет</p>
                <p className="text-xl">
                  {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск проектов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">Все статусы</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label} {statusCounts[status] ? `(${statusCounts[status]})` : ''}
                </option>
              ))}
            </select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список проектов ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Проект</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Этап</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead>Дедлайн</TableHead>
                <TableHead>Оплата</TableHead>
                <TableHead>Прогресс</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <ProjectDetailsDialog
                  project={project}
                  trigger={
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground">#{project.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{project.clientName}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[project.status].color}>
                          {statusConfig[project.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(project.manager)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{project.manager}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            isOverdue(project.deadline) && project.status !== 'closed' 
                              ? 'text-red-600' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatDate(project.deadline)}
                          </span>
                          {isOverdue(project.deadline) && project.status !== 'closed' && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-green-600">{formatCurrency(project.prepayment)}</p>
                          {project.remaining > 0 && (
                            <p className="text-muted-foreground">
                              осталось: {formatCurrency(project.remaining)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-20">
                          <Progress value={project.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.progress}%
                          </p>
                        </div>
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
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg mb-2">Проекты не найдены</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Попробуйте изменить параметры поиска или фильтры'
                : 'Создайте первый проект для начала работы'
              }
            </p>
            <div className="flex gap-2 justify-center">
              {(searchQuery || statusFilter !== 'all') && (
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}>
                  Сбросить фильтры
                </Button>
              )}
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Новый проект
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}