import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Auto-initialize database on first request
let isInitialized = false;

async function checkAndInitializeDatabase() {
  if (isInitialized) return;

  try {
    // Check if database is already initialized using KV store
    const initStatus = await kv.get('db_initialized');
    if (initStatus === 'true') {
      isInitialized = true;
      return;
    }

    console.log('Database not initialized. Initializing with KV store...');
    
    // Always use KV store as primary data source
    await initializeWithKVStore();
    await kv.set('db_initialized', 'true');
    isInitialized = true;
    
    console.log('Database initialized with KV store');
  } catch (error) {
    console.error('Database initialization error:', error);
    // Still try to set as initialized
    await kv.set('db_initialized', 'true');
    isInitialized = true;
  }
}

// Initialize with sample data in KV store
async function initializeWithKVStore() {
  console.log('Initializing with KV store...');
  
  // Check if data already exists
  const existingClients = await kv.get('clients');
  if (existingClients) {
    console.log('KV store already has data, skipping initialization');
    return;
  }
  
  const sampleClients = [
    {
      id: 'client-1',
      name: 'Петров Иван Васильевич',
      company: 'ИП Петров',
      tax_id: '123456789012',
      notes: 'Заинтересован в кухонном гарнитуре. Квартира в новостройке.',
      tags: ['VIP'],
      contacts: [
        { kind: 'phone', value: '+7 (495) 123-45-67', is_primary: true },
        { kind: 'telegram', value: '@petrov_iv', is_primary: false }
      ],
      projects: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'client-2',
      name: 'Сидорова Мария Петровна',
      company: '',
      tax_id: '',
      notes: 'Требует изготовление офисной мебели',
      tags: ['Офис'],
      contacts: [
        { kind: 'email', value: 'maria@example.com', is_primary: true },
        { kind: 'phone', value: '+7 (499) 987-65-43', is_primary: false }
      ],
      projects: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const sampleProjects = [
    {
      id: 'project-1',
      client_id: 'client-1',
      title: 'Кухонный гарнитур',
      description: 'Изготовление кухонного гарнитура для квартиры в новостройке',
      status: 'lead',
      manager_id: 'user-1',
      budget: 300000,
      project_number: '2024-001',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      client: { name: 'Петров Иван Васильевич', company: 'ИП Петров' },
      manager: { name: 'Анна Иванова' },
      payments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'project-2',
      client_id: 'client-2',
      title: 'Офисная мебель',
      description: 'Комплект офисной мебели для стартапа',
      status: 'measurement',
      manager_id: 'user-1',
      budget: 150000,
      project_number: '2024-002',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      client: { name: 'Сидорова Мария Петровна', company: '' },
      manager: { name: 'Анна Иванова' },
      payments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const sampleTasks = [
    {
      id: 'task-1',
      project_id: 'project-1',
      type: 'measurement',
      stage: 'pending',
      title: 'Замер кухни',
      description: 'Выезд на замер кухонного помещения',
      assignee_id: 'user-1',
      status: 'pending',
      priority: 'high',
      due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      project: { id: 'project-1', title: 'Кухонный гарнитур', project_number: '2024-001' },
      assignee: { name: 'Анна Иванова' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'task-2',
      project_id: 'project-1',
      type: 'design',
      stage: 'pending',
      title: 'Создание дизайн-проекта',
      description: 'Разработка дизайна кухни с 3D визуализацией',
      assignee_id: 'user-2',
      status: 'pending',
      priority: 'normal',
      due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      project: { id: 'project-1', title: 'Кухонный гарнитур', project_number: '2024-001' },
      assignee: { name: 'Дизайнер' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'task-3',
      project_id: 'project-2',
      type: 'measurement',
      stage: 'in_progress',
      title: 'Замер офиса',
      description: 'Замер офисного помещения для мебели',
      assignee_id: 'user-1',
      status: 'in_progress',
      priority: 'normal',
      due_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      project: { id: 'project-2', title: 'Офисная мебель', project_number: '2024-002' },
      assignee: { name: 'Анна Иванова' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const sampleThreads = [
    {
      id: 'thread-1',
      client_id: 'client-1',
      project_id: 'project-1',
      channel: 'telegram',
      channel_thread_id: 'demo_thread_1',
      assignee_id: 'user-1',
      status: 'open',
      last_message_at: new Date().toISOString(),
      client: { name: 'Петров Иван Васильевич', company: 'ИП Петров' },
      project: { id: 'project-1', title: 'Кухонный гарнитур', project_number: '2024-001' },
      assignee: { name: 'Анна Иванова' },
      messages: [
        {
          id: 'msg-1',
          body: 'Здравствуйте! Интересует изготовление кухонного гарнитура.',
          direction: 'in'
        },
        {
          id: 'msg-2', 
          body: 'Здравствуйте! Будем рады помочь с кухонным гарнитуром. Для расчета нужны размеры помещения.',
          direction: 'out'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'thread-2',
      client_id: 'client-2',
      project_id: 'project-2',
      channel: 'email',
      channel_thread_id: 'demo_thread_2',
      assignee_id: 'user-1',
      status: 'open',
      last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      client: { name: 'Сидорова Мария Петровна', company: '' },
      project: { id: 'project-2', title: 'Офисная мебель', project_number: '2024-002' },
      assignee: { name: 'Анна Иванова' },
      messages: [
        {
          id: 'msg-3',
          body: 'Добрый день! Нужна офисная мебель для нашего стартапа.',
          direction: 'in'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Store sample data in KV
  await kv.set('clients', JSON.stringify(sampleClients));
  await kv.set('projects', JSON.stringify(sampleProjects));
  await kv.set('tasks', JSON.stringify(sampleTasks));
  await kv.set('threads', JSON.stringify(sampleThreads));

  console.log('Sample data stored in KV store');
}

// Authentication middleware
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  // Special case: allow public anon key for test operations
  if (accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    c.set('user', { id: 'anonymous', email: 'anonymous@system', name: 'System' });
    await next();
    return;
  }
  
  if (!accessToken) {
    return c.json({ error: 'Missing authorization token' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  // Use auth user data directly since we're not using PostgreSQL users table
  c.set('user', { 
    id: user.id, 
    email: user.email, 
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
    role: user.user_metadata?.role || 'manager'
  });
  
  await next();
}

// Health check
app.get('/make-server-73ccbe73/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database initialization route
app.post('/make-server-73ccbe73/init-database', async (c) => {
  try {
    console.log('Starting database initialization with KV store...');
    
    // Initialize with KV store data
    await initializeWithKVStore();
    
    // Mark as initialized
    await kv.set('db_initialized', 'true');
    isInitialized = true;

    console.log('Database initialized successfully with KV store');
    return c.json({ message: 'Database initialized successfully with KV store' });

  } catch (error) {
    console.error('Database initialization error:', error);
    return c.json({ error: `Failed to initialize database: ${error.message}` }, 500);
  }
});



// Authentication routes
app.post('/make-server-73ccbe73/auth/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Test user creation route
app.post('/make-server-73ccbe73/auth/create-test-user', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm since email server isn't configured
    });

    if (error && !error.message.includes('already registered')) {
      console.error('Test user creation error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Initialize database with sample data
    await checkAndInitializeDatabase();

    return c.json({ 
      user: data?.user || { email, id: 'existing' },
      message: error?.message.includes('already registered') ? 'User already exists' : 'User created successfully'
    }, 201);
  } catch (error) {
    console.error('Test user creation error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Dashboard stats
app.get('/make-server-73ccbe73/dashboard/stats', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const kvProjects = await kv.get('projects');
    const kvTasks = await kv.get('tasks');
    
    const projectsData = kvProjects ? JSON.parse(kvProjects) : [];
    const tasksData = kvTasks ? JSON.parse(kvTasks) : [];
    
    const now = new Date();
    const overdueCount = projectsData.filter((p: any) => 
      p.deadline && new Date(p.deadline) < now && p.status !== 'closed'
    ).length;
    
    const awaitingPaymentCount = projectsData.filter((p: any) => 
      p.status === 'awaiting_prepayment'
    ).length;
    
    const activeTasksCount = tasksData.filter((t: any) => 
      ['pending', 'in_progress'].includes(t.status)
    ).length;
    
    const productionLoad = Math.min(Math.round(activeTasksCount / 20 * 100), 100);
    
    return c.json({
      activeProjects: projectsData.length,
      overdue: overdueCount,
      awaitingPayment: awaitingPaymentCount,
      productionLoad,
      recentEvents: []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({
      activeProjects: 0,
      overdue: 0,
      awaitingPayment: 0,
      productionLoad: 0,
      recentEvents: []
    });
  }
});

// Clients routes
app.get('/make-server-73ccbe73/clients', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const kvClients = await kv.get('clients');
    const clientsData = kvClients ? JSON.parse(kvClients) : [];
    return c.json({ clients: clientsData });
  } catch (error) {
    console.error('Clients error:', error);
    return c.json({ clients: [] });
  }
});

app.post('/make-server-73ccbe73/clients', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const { name, company, taxId, notes, contacts } = await c.req.json();

    const newClient = {
      id: `client-${Date.now()}`,
      name,
      company: company || '',
      tax_id: taxId || '',
      notes: notes || '',
      tags: [],
      contacts: contacts || [],
      projects: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const kvClients = await kv.get('clients');
    const clientsData = kvClients ? JSON.parse(kvClients) : [];
    clientsData.push(newClient);
    await kv.set('clients', JSON.stringify(clientsData));
    
    return c.json({ client: newClient }, 201);
  } catch (error) {
    console.error('Client creation error:', error);
    return c.json({ error: 'Failed to create client' }, 500);
  }
});

// Projects routes
app.get('/make-server-73ccbe73/projects', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const kvProjects = await kv.get('projects');
    const projectsData = kvProjects ? JSON.parse(kvProjects) : [];
    return c.json({ projects: projectsData });
  } catch (error) {
    console.error('Projects error:', error);
    return c.json({ projects: [] });
  }
});

app.post('/make-server-73ccbe73/projects', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const user = c.get('user');
    const { clientId, title, description, budget, deadline } = await c.req.json();

    // Generate project number
    const year = new Date().getFullYear();
    const kvProjects = await kv.get('projects');
    const projectsData = kvProjects ? JSON.parse(kvProjects) : [];
    const projectCount = projectsData.filter((p: any) => p.created_at.startsWith(year.toString())).length;
    const projectNumber = `${year}-${String(projectCount + 1).padStart(3, '0')}`;

    const newProject = {
      id: `project-${Date.now()}`,
      client_id: clientId,
      title,
      description,
      budget,
      deadline,
      project_number: projectNumber,
      manager_id: user.id,
      status: 'lead',
      client: { name: 'Клиент', company: '' },
      manager: { name: user.name || 'Менеджер' },
      payments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    projectsData.push(newProject);
    await kv.set('projects', JSON.stringify(projectsData));
    
    return c.json({ project: newProject }, 201);
  } catch (error) {
    console.error('Project creation error:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Tasks routes (for Kanban)
app.get('/make-server-73ccbe73/tasks', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const kvTasks = await kv.get('tasks');
    const tasksData = kvTasks ? JSON.parse(kvTasks) : [];
    return c.json({ tasks: tasksData });
  } catch (error) {
    console.error('Tasks error:', error);
    return c.json({ tasks: [] });
  }
});

app.post('/make-server-73ccbe73/tasks', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const user = c.get('user');
    const { projectId, type, stage, title, description, assigneeId, dueAt, priority } = await c.req.json();

    const newTask = {
      id: `task-${Date.now()}`,
      project_id: projectId,
      type,
      stage,
      title,
      description,
      assignee_id: assigneeId,
      due_at: dueAt,
      priority: priority || 'normal',
      status: 'pending',
      project: { id: projectId, title: 'Проект', project_number: '2024-XXX' },
      assignee: { name: user.name || 'Сотрудник' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const kvTasks = await kv.get('tasks');
    const tasksData = kvTasks ? JSON.parse(kvTasks) : [];
    tasksData.push(newTask);
    await kv.set('tasks', JSON.stringify(tasksData));

    return c.json({ task: newTask }, 201);
  } catch (error) {
    console.error('Task creation error:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Update task status
app.patch('/make-server-73ccbe73/tasks/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const { status, stage } = await c.req.json();

    const kvTasks = await kv.get('tasks');
    const tasksData = kvTasks ? JSON.parse(kvTasks) : [];
    
    const taskIndex = tasksData.findIndex((t: any) => t.id === taskId);
    if (taskIndex === -1) {
      return c.json({ error: 'Task not found' }, 404);
    }
    
    const updatedTask = { 
      ...tasksData[taskIndex], 
      status, 
      stage,
      updated_at: new Date().toISOString()
    };
    
    tasksData[taskIndex] = updatedTask;
    await kv.set('tasks', JSON.stringify(tasksData));

    return c.json({ task: updatedTask });
  } catch (error) {
    console.error('Task update error:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Threads and messages routes (Omni-Inbox)
app.get('/make-server-73ccbe73/threads', requireAuth, async (c) => {
  await checkAndInitializeDatabase();
  
  try {
    const kvThreads = await kv.get('threads');
    const threadsData = kvThreads ? JSON.parse(kvThreads) : [];
    return c.json({ threads: threadsData });
  } catch (error) {
    console.error('Threads error:', error);
    return c.json({ threads: [] });
  }
});

app.get('/make-server-73ccbe73/threads/:id/messages', requireAuth, async (c) => {
  try {
    const threadId = c.req.param('id');

    const kvThreads = await kv.get('threads');
    const threadsData = kvThreads ? JSON.parse(kvThreads) : [];
    const thread = threadsData.find((t: any) => t.id === threadId);
    
    if (!thread) {
      return c.json({ messages: [] });
    }

    return c.json({ messages: thread.messages || [] });
  } catch (error) {
    console.error('Messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

app.post('/make-server-73ccbe73/threads/:id/messages', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const threadId = c.req.param('id');
    const { body, isInternal } = await c.req.json();

    const newMessage = {
      id: `msg-${Date.now()}`,
      thread_id: threadId,
      direction: 'out',
      sender_user_id: user.id,
      body,
      is_internal: isInternal || false,
      sender: { name: user.name || 'Сотрудник' },
      created_at: new Date().toISOString()
    };

    // Update thread with new message
    const kvThreads = await kv.get('threads');
    const threadsData = kvThreads ? JSON.parse(kvThreads) : [];
    const threadIndex = threadsData.findIndex((t: any) => t.id === threadId);
    
    if (threadIndex !== -1) {
      if (!threadsData[threadIndex].messages) {
        threadsData[threadIndex].messages = [];
      }
      threadsData[threadIndex].messages.push(newMessage);
      threadsData[threadIndex].last_message_at = new Date().toISOString();
      await kv.set('threads', JSON.stringify(threadsData));
    }

    return c.json({ message: newMessage }, 201);
  } catch (error) {
    console.error('Message creation error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Payments routes
app.get('/make-server-73ccbe73/projects/:id/payments', requireAuth, async (c) => {
  try {
    const projectId = c.req.param('id');

    // Get payments from KV store (would be stored separately or with project data)
    const kvPayments = await kv.get(`payments_${projectId}`);
    const paymentsData = kvPayments ? JSON.parse(kvPayments) : [];

    return c.json({ payments: paymentsData });
  } catch (error) {
    console.error('Payments error:', error);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

app.post('/make-server-73ccbe73/projects/:id/payments', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const projectId = c.req.param('id');
    const { amount, paymentType, method, notes } = await c.req.json();

    const newPayment = {
      id: `payment-${Date.now()}`,
      project_id: projectId,
      amount,
      payment_type: paymentType,
      method,
      notes,
      status: 'paid',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Store payment in KV store
    const kvPayments = await kv.get(`payments_${projectId}`);
    const paymentsData = kvPayments ? JSON.parse(kvPayments) : [];
    paymentsData.push(newPayment);
    await kv.set(`payments_${projectId}`, JSON.stringify(paymentsData));

    return c.json({ payment: newPayment }, 201);
  } catch (error) {
    console.error('Payment creation error:', error);
    return c.json({ error: 'Failed to record payment' }, 500);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

Deno.serve(app.fetch);