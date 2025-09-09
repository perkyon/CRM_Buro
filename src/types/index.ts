// User roles and permissions
export type UserRole = 'manager' | 'measurer' | 'technologist' | 'production_manager' | 'master' | 'finance' | 'director' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

// Client management
export interface Contact {
  id: string;
  clientId: string;
  kind: 'telegram' | 'whatsapp' | 'email' | 'phone';
  value: string;
  extIds?: Record<string, string>;
}

export interface Client {
  id: string;
  name: string;
  taxId?: string;
  notes?: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

// Project management
export type ProjectStatus = 
  | 'lead'
  | 'measurement_assigned'
  | 'measurement_received'
  | 'tech_project_kp'
  | 'awaiting_prepayment'
  | 'to_production'
  | 'in_production'
  | 'sanding'
  | 'painting'
  | 'assembly'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'installation_delivery'
  | 'closing_documents'
  | 'closed';

export interface Project {
  id: string;
  clientId: string;
  title: string;
  status: ProjectStatus;
  managerId: string;
  technologistId?: string;
  prodManagerId?: string;
  budget?: number;
  marginPlan?: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

// Communication (Omni-Inbox)
export interface Thread {
  id: string;
  clientId: string;
  projectId?: string;
  channel: 'telegram' | 'whatsapp' | 'email';
  channelThreadId: string;
  assigneeId?: string;
  status: 'open' | 'in_progress' | 'waiting_client' | 'closed';
  lastMessageAt: string;
  slaBreached?: boolean;
}

export interface Message {
  id: string;
  threadId: string;
  direction: 'in' | 'out';
  senderUserId?: string;
  body: string;
  isInternal: boolean;
  attachments: string[];
  extMessageId?: string;
  inReplyTo?: string;
  createdAt: string;
}

// Tasks and production
export type TaskType = 'measurement' | 'design' | 'sanding' | 'painting' | 'assembly' | 'installation';

export interface Task {
  id: string;
  projectId: string;
  type: TaskType;
  stage: string;
  assigneeId: string;
  title: string;
  description?: string;
  dueAt?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  payload?: Record<string, any>;
  createdAt: string;
}

// Financial management
export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
  docId?: string;
}

export interface Document {
  id: string;
  projectId: string;
  type: 'kp' | 'invoice' | 'act' | 'drawing';
  version: number;
  fileId: string;
  meta?: Record<string, any>;
  createdAt: string;
}

// Dashboard and reporting
export interface DashboardStats {
  activeProjects: number;
  overdue: number;
  awaitingPayment: number;
  productionLoad: number;
  revenue: number;
  margin: number;
}

export interface ActivityEvent {
  id: string;
  projectId?: string;
  entity: string;
  entityId: string;
  action: string;
  userId: string;
  meta?: Record<string, any>;
  createdAt: string;
}