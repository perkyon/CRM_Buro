import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface AddTaskDialogProps {
  trigger: React.ReactNode;
  onSuccess?: (task: any) => void;
  columnId?: string;
}

export function AddTaskDialog({ trigger, onSuccess, columnId }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    column: columnId || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Здесь будет логика добавления задачи
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      if (onSuccess) onSuccess(formData);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить задачу</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название задачи</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="assignee">Ответственный</Label>
            <Input id="assignee" name="assignee" value={formData.assignee} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="dueDate">Срок</Label>
            <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Добавление...' : 'Добавить'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
