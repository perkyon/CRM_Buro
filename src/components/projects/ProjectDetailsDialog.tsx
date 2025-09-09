import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, DollarSign, FolderOpen, AlertTriangle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: string;
  manager: string;
  deadline: string;
  budget: number;
  prepayment: number;
  remaining: number;
  progress: number;
  createdAt: string;
}

interface ProjectDetailsDialogProps {
  project: Project;
  trigger: React.ReactNode;
  onSave?: (project: Project) => void;
}

export function ProjectDetailsDialog({ project, trigger, onSave }: ProjectDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Project>(project);
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
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
          <DialogTitle>Информация о проекте</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input id="title" name="title" value={editData.title} onChange={handleChange} disabled={!editing} />
            </div>
            <div>
              <Label htmlFor="clientName">Клиент</Label>
              <Input id="clientName" name="clientName" value={editData.clientName} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager">Менеджер</Label>
              <Input id="manager" name="manager" value={editData.manager} onChange={handleChange} disabled={!editing} />
            </div>
            <div>
              <Label htmlFor="deadline">Дедлайн</Label>
              <Input id="deadline" name="deadline" type="date" value={editData.deadline} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Бюджет</Label>
              <Input id="budget" name="budget" type="number" value={editData.budget} onChange={handleChange} disabled={!editing} />
            </div>
            <div>
              <Label htmlFor="prepayment">Предоплата</Label>
              <Input id="prepayment" name="prepayment" type="number" value={editData.prepayment} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
          <div>
            <Label htmlFor="progress">Прогресс</Label>
            <Progress value={editData.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{editData.progress}%</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">#{editData.id}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" /> {editData.deadline}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" /> {editData.budget}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <FolderOpen className="w-3 h-3" /> {editData.status}
            </span>
            {editData.remaining > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Осталось: {editData.remaining}
              </span>
            )}
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
