import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Plus, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface AddClientDialogProps {
  trigger: React.ReactNode;
  onSuccess?: (client: any) => void;
}

interface Contact {
  kind: 'phone' | 'email' | 'telegram' | 'whatsapp';
  value: string;
  isPrimary: boolean;
}

export function AddClientDialog({ trigger, onSuccess }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createClient } = useData();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    taxId: '',
    notes: ''
  });

  const [contacts, setContacts] = useState<Contact[]>([
    { kind: 'phone', value: '', isPrimary: true }
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const addContact = () => {
    setContacts([...contacts, { kind: 'phone', value: '', isPrimary: false }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: keyof Contact, value: any) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const validContacts = contacts.filter(c => c.value.trim());
      const clientData = {
        ...formData,
        contacts: validContacts,
        tags
      };

      const client = await createClient(clientData);
      
      setOpen(false);
      onSuccess?.(client);
      
      // Reset form
      setFormData({ name: '', company: '', taxId: '', notes: '' });
      setContacts([{ kind: 'phone' as const, value: '', isPrimary: true }]);
      setTags([]);
      setNewTag('');
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить клиента</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Имя / Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Петров Иван Васильевич"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="ООО «Пример»"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="taxId">ИНН / Налоговый номер</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="1234567890"
              />
            </div>

            <div>
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Дополнительная информация о клиенте..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Contacts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Контакты</Label>
              <Button type="button" variant="outline" size="sm" onClick={addContact}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить контакт
              </Button>
            </div>

            {contacts.map((contact, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Select
                    value={contact.kind}
                    onValueChange={(value: any) => updateContact(index, 'kind', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Телефон</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-[2]">
                  <Input
                    value={contact.value}
                    onChange={(e) => updateContact(index, 'value', e.target.value)}
                    placeholder={
                      contact.kind === 'phone' ? '+7 (495) 123-45-67' :
                      contact.kind === 'email' ? 'example@domain.com' :
                      contact.kind === 'telegram' ? '@username' :
                      '+7 (495) 123-45-67'
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={contact.isPrimary}
                      onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                    />
                    Основной
                  </label>
                  {contacts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <Label>Теги</Label>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Добавить тег..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Добавить
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Создание...' : 'Создать клиента'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}