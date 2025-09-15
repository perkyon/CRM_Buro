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
  checklist: Record<string, boolean>;
  notes?: string;
  photos?: string[];
  skipFlags?: { noPaint?: boolean; noDrill?: boolean };
}

export default WorkOrder;
