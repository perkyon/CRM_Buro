import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { CheckCircle, AlertTriangle, Clock, Paperclip } from 'lucide-react';

interface Task {
  id: string;
  projectId: string;
  projectTitle: string;
  component: string;
  assignee: string;
  dueDate: string;
  priority: string;
  checklist: { id: number; text: string; completed: boolean }[];
  attachments?: number;
}

interface TaskDetailsDialogProps {
  task: Task;
  trigger: React.ReactNode;
  onSave?: (task: Task) => void;
}

export function TaskDetailsDialog({ task, trigger, onSave }: TaskDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Task>(task);
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleChecklistToggle = (id: number) => {
    setEditData({
      ...editData,
      checklist: editData.checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const handleSave = () => {
    setEditing(false);
    setOpen(false);
    if (onSave) onSave(editData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Информация о задаче</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectTitle">Проект</Label>
              <Input id="projectTitle" name="projectTitle" value={editData.projectTitle} onChange={handleChange} disabled={!editing} />
            </div>
            <div>
              <Label htmlFor="component">Компонент</Label>
              <Input id="component" name="component" value={editData.component} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
          <div>
            <Label htmlFor="assignee">Ответственный</Label>
            <Input id="assignee" name="assignee" value={editData.assignee} onChange={handleChange} disabled={!editing} />
          </div>
          <div>
            <Label htmlFor="dueDate">Срок</Label>
            <Input id="dueDate" name="dueDate" type="date" value={editData.dueDate} onChange={handleChange} disabled={!editing} />
          </div>
          <div>
            <Label>Чек-лист</Label>
            <div className="space-y-2">
              {editData.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Button variant={item.completed ? 'default' : 'outline'} size="sm" onClick={() => editing && handleChecklistToggle(item.id)}>
                    <CheckCircle className={`w-4 h-4 ${item.completed ? 'text-green-500' : 'text-gray-300'}`} />
                  </Button>
                  <span className={item.completed ? 'line-through text-muted-foreground' : ''}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">#{editData.projectId}</Badge>
            {editData.priority === 'high' && <Badge variant="destructive">Высокий приоритет</Badge>}
            {editData.attachments && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="w-3 h-3" /> {editData.attachments}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> {editData.dueDate}
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {!editing ? (
              <Button variant="outline" onClick={() => setEditing(true)}>Редактировать</Button>
            ) : (
              <Button onClick={handleSave}>Сохранить</Button>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)}>Закрыть</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
