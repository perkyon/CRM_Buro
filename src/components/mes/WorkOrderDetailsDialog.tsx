import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { useMes } from '../../stores/mesContext';
import type { WorkOrder } from '../../domain/work';
import { STAGE_RU } from '../../i18n/ru';
import { Play, Square, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

export const WorkOrderDetailsDialog: React.FC<{ work: WorkOrder; trigger: React.ReactNode; onReady?: () => void }> = ({ work, trigger, onReady }) => {
  const { updateChecklistItem, setSkipFlags, updateFields, startTimer, stopTimer } = useMes();
  const [open, setOpen] = useState(false);
  const [packingListUrl, setPackingListUrl] = useState(work.packingListUrl || '');
  const [photos, setPhotos] = useState<string[]>(work.photos || []);
  const [assignee, setAssignee] = useState(work.assignee || '');
  const [dueDate, setDueDate] = useState(work.dueDate || '');
  const [notes, setNotes] = useState(work.notes || '');

  const handleChecklistToggle = (k: string, v: boolean) => updateChecklistItem(work.id, k, v);

  const handleSaveMeta = () => {
    updateFields(work.id, { packingListUrl, photos, assignee, dueDate, notes });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {work.projectId} • {work.name} — {STAGE_RU[work.stage as any] || work.stage}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ответственный</Label>
              <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Начальник цеха" />
            </div>
            <div>
              <Label>Срок</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Чек-лист</Label>
            <div className="mt-2 space-y-2">
              {Object.entries(work.checklist || {}).map(([k, v]) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={!!v} onCheckedChange={(val: any) => handleChecklistToggle(k, !!val)} />
                  <span>{k}</span>
                </label>
              ))}
              {Object.keys(work.checklist || {}).length === 0 && (
                <div className="text-xs text-muted-foreground">Для этого этапа чек-лист пуст</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-between border rounded p-2">
              <span className="text-sm">Без присадки</span>
              <Switch checked={!!work.skipFlags?.noDrill} onCheckedChange={(val: any) => setSkipFlags(work.id, { noDrill: !!val })} />
            </label>
            <label className="flex items-center justify-between border rounded p-2">
              <span className="text-sm">Без покраски</span>
              <Switch checked={!!work.skipFlags?.noPaint} onCheckedChange={(val: any) => setSkipFlags(work.id, { noPaint: !!val })} />
            </label>
          </div>

          <div>
            <Label>Заметки</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Packing list (URL)</Label>
              <div className="flex gap-2">
                <Input value={packingListUrl} onChange={(e) => setPackingListUrl(e.target.value)} placeholder="https://..." />
                <Button type="button" variant="outline"><Upload className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <Label>Фото комплектации (URL через запятую)</Label>
              <div className="flex gap-2">
                <Input value={photos.join(',')} onChange={(e) => setPhotos(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="https://img1, https://img2" />
                <Button type="button" variant="outline"><ImageIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="button" variant={work.status === 'IN_PROGRESS' ? 'destructive' : 'default'} onClick={() => (work.status === 'IN_PROGRESS' ? stopTimer(work.id) : startTimer(work.id))}>
                {work.status === 'IN_PROGRESS' ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {work.status === 'IN_PROGRESS' ? 'Стоп' : 'Старт'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Закрыть</Button>
              <Button onClick={handleSaveMeta}><CheckCircle2 className="w-4 h-4 mr-1" /> Сохранить</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderDetailsDialog;
