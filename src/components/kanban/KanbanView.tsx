import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { AddTaskDialog } from '../dialogs/AddTaskDialog';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import { 
  Clock, 
  Paperclip, 
  MoreHorizontal, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter
} from 'lucide-react';

export function KanbanView() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const columns = [
    { id: 'incoming', title: 'Входящие', count: 3 },
    { id: 'sanding', title: 'Шлифовка', count: 4 },
    { id: 'painting', title: 'Покраска', count: 2 },
    { id: 'assembly', title: 'Сборка', count: 5 },
    { id: 'quality_check', title: 'Приёмка', count: 1 }
  ];

  const tasks = [
    {
      id: 'task-1',
      projectId: '2024-156',
      projectTitle: 'Кухонный гарнитур',
      component: 'Верхние шкафы',
      assignee: 'Иванов П.',
      dueDate: '2024-09-05',
      status: 'incoming',
      priority: 'high',
      checklist: [
        { id: 1, text: 'Подготовить материалы', completed: true },
        { id: 2, text: 'Раскрой деталей', completed: true },
        { id: 3, text: 'Проверить размеры', completed: false }
      ],
      attachments: 2
    },
    {
      id: 'task-2',
      projectId: '2024-155',
      projectTitle: 'Офисная мебель',
      component: 'Рабочие столы',
      assignee: 'Сидоров А.',
      dueDate: '2024-09-04',
      status: 'sanding',
      priority: 'normal',
      checklist: [
        { id: 1, text: 'Шлифовка P120', completed: true },
        { id: 2, text: 'Шлифовка P220', completed: false },
        { id: 3, text: 'Финишная шлифовка', completed: false }
      ],
      attachments: 1
    },
    {
      id: 'task-3',
      projectId: '2024-154',
      projectTitle: 'Гардеробная система',
      component: 'Двери шкафа',
      assignee: 'Петров М.',
      dueDate: '2024-09-06',
      status: 'painting',
      priority: 'normal',
      checklist: [
        { id: 1, text: 'Грунтовка', completed: true },
        { id: 2, text: 'Первый слой краски', completed: true },
        { id: 3, text: 'Второй слой краски', completed: false }
      ],
      attachments: 0
    },
    {
      id: 'task-4',
      projectId: '2024-153',
      projectTitle: 'Обеденный стол',
      component: 'Столешница',
      assignee: 'Козлов С.',
      dueDate: '2024-09-03',
      status: 'assembly',
      priority: 'high',
      checklist: [
        { id: 1, text: 'Сборка каркаса', completed: true },
        { id: 2, text: 'Установка столешницы', completed: false },
        { id: 3, text: 'Финальная проверка', completed: false }
      ],
      attachments: 3
    },
    {
      id: 'task-5',
      projectId: '2024-152',
      projectTitle: 'Спальный гарнитур',
      component: 'Кровать',
      assignee: 'Волков Д.',
      dueDate: '2024-09-02',
      status: 'quality_check',
      priority: 'normal',
      checklist: [
        { id: 1, text: 'Проверка качества', completed: true },
        { id: 2, text: 'Упаковка', completed: false }
      ],
      attachments: 1
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
  };

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter(task => task.status === columnId);
  };

  const getCompletedChecklistCount = (checklist: any[]) => {
    return checklist.filter(item => item.completed).length;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl mb-2">Канбан производства</h1>
            <p className="text-muted-foreground">Управление задачами в цехе</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
            <AddTaskDialog trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Новая задача
              </Button>
            } />
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex gap-2">
          <Button 
            variant={selectedFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            Все задачи
          </Button>
          <Button 
            variant={selectedFilter === 'my' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedFilter('my')}
          >
            Мои задачи
          </Button>
          <Button 
            variant={selectedFilter === 'overdue' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedFilter('overdue')}
          >
            Просроченные
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full min-w-max">
          {columns.map((column) => {
            const columnTasks = getTasksForColumn(column.id);
            
            return (
              <div key={column.id} className="w-80 flex-shrink-0 border-r border-border bg-muted/30">
                <div className="p-4 border-b border-border bg-background">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{column.title}</h3>
                    <Badge variant="secondary">{columnTasks.length}</Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 h-full overflow-y-auto">
                  {columnTasks.map((task) => (
                    <TaskDetailsDialog
                      task={task}
                      trigger={
                        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <Badge variant="outline" className="text-xs mb-2">
                                    #{task.projectId}
                                  </Badge>
                                  <h4 className="text-sm font-medium line-clamp-2">
                                    {task.projectTitle}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {task.component}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Checklist Progress */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Прогресс</span>
                                  <span>
                                    {getCompletedChecklistCount(task.checklist)}/{task.checklist.length}
                                  </span>
                                </div>
                                <div className="grid gap-1">
                                  {task.checklist.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2 text-xs">
                                      <CheckCircle 
                                        className={`w-3 h-3 ${
                                          item.completed ? 'text-green-500' : 'text-gray-300'
                                        }`} 
                                      />
                                      <span className={item.completed ? 'text-muted-foreground line-through' : ''}>
                                        {item.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">
                                    {task.assignee}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {task.attachments > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{task.attachments}</span>
                                    </div>
                                  )}
                                  
                                  <div className={`flex items-center gap-1 text-xs ${
                                    isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'
                                  }`}>
                                    {isOverdue(task.dueDate) && (
                                      <AlertTriangle className="w-3 h-3" />
                                    )}
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(task.dueDate)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      }
                    />
                  ))}
                  
                  {/* Add task button */}
                  <AddTaskDialog 
                    trigger={
                      <Button variant="ghost" className="w-full border-2 border-dashed border-muted-foreground/25 h-12">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить задачу
                      </Button>
                    }
                    columnId={column.id}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}