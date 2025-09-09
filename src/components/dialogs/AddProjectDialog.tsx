import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface AddProjectDialogProps {
  trigger: React.ReactNode;
  onSuccess?: (project: any) => void;
}

export function AddProjectDialog({ trigger, onSuccess }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    deadline: ''
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
    // Здесь будет логика добавления проекта
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
          <DialogTitle>Создать проект</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название проекта</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="client">Клиент</Label>
            <Input id="client" name="client" value={formData.client} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="deadline">Дедлайн</Label>
            <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Создание...' : 'Создать'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
