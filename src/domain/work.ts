import { ShopStage } from './stages';

export interface WorkOrder {
  id: string;
  projectId: string;
  name: string;            // узел/зона: "Фасады 1"
  stage: ShopStage;
  status: 'QUEUED' | 'IN_PROGRESS' | 'DONE' | 'REWORK';
  planStart?: string; planEnd?: string;
  actualStart?: string; actualEnd?: string;
  timeMinutes: number;
  timerStartAt?: number; // epoch ms when timer started
  assignee?: string;
  dueDate?: string; // план окончания текущего этапа
  checklist: Record<string, boolean>;
  notes?: string;
  photos?: string[];
  packingListUrl?: string; // ссылка/файл (url) на packing list
  skipFlags?: { noPaint?: boolean; noDrill?: boolean };
}

export default WorkOrder;
