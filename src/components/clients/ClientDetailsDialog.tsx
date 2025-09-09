import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Client {
  name: string;
  company: string;
  taxId: string;
  notes: string;
  contacts: { kind: string; value: string; isPrimary: boolean }[];
  tags: string[];
}

interface ClientDetailsDialogProps {
  client: Client;
  trigger: React.ReactNode;
  onSave?: (client: Client) => void;
}

export function ClientDetailsDialog({ client, trigger, onSave }: ClientDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Client>(client);
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <DialogTitle>Информация о клиенте</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Имя / Название</Label>
              <Input id="name" name="name" value={editData.name} onChange={handleChange} disabled={!editing} />
            </div>
            <div>
              <Label htmlFor="company">Компания</Label>
              <Input id="company" name="company" value={editData.company} onChange={handleChange} disabled={!editing} />
            </div>
          </div>
          <div>
            <Label htmlFor="taxId">ИНН / Налоговый номер</Label>
            <Input id="taxId" name="taxId" value={editData.taxId} onChange={handleChange} disabled={!editing} />
          </div>
          <div>
            <Label htmlFor="notes">Заметки</Label>
            <Textarea id="notes" name="notes" value={editData.notes} onChange={handleChange} disabled={!editing} />
          </div>
          <div>
            <Label>Контакты</Label>
            <div className="space-y-2">
              {editData.contacts.map((contact, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input value={contact.value} disabled={!editing} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{contact.kind}</span>
                  {contact.isPrimary && <span className="text-xs text-primary">Основной</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Теги</Label>
            <div className="flex gap-2 flex-wrap">
              {editData.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-muted rounded text-xs">{tag}</span>
              ))}
            </div>
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
