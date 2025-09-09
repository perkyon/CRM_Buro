import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DataContextType {
  // Dashboard
  dashboardStats: any;
  fetchDashboardStats: () => Promise<void>;
  
  // Clients
  clients: any[];
  fetchClients: () => Promise<void>;
  createClient: (clientData: any) => Promise<any>;
  
  // Projects
  projects: any[];
  fetchProjects: () => Promise<void>;
  createProject: (projectData: any) => Promise<any>;
  
  // Tasks
  tasks: any[];
  fetchTasks: () => Promise<void>;
  createTask: (taskData: any) => Promise<any>;
  updateTask: (taskId: string, updates: any) => Promise<any>;
  
  // Threads and Messages
  threads: any[];
  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<any[]>;
  sendMessage: (threadId: string, messageData: any) => Promise<any>;
  
  // Payments
  fetchPayments: (projectId: string) => Promise<any[]>;
  createPayment: (projectId: string, paymentData: any) => Promise<any>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-73ccbe73${endpoint}`;
    
    // Use access token if available, otherwise fall back to public anon key
    const authToken = accessToken || publicAnonKey;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error(`API request failed for ${endpoint}:`, err);
      throw err;
    }
  };

  // Dashboard
  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const data = await apiRequest('/dashboard/stats');
      setDashboardStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      console.error('Dashboard stats error:', err);
    }
  };

  // Clients
  const fetchClients = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await apiRequest('/clients');
      setClients(data.clients || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      console.error('Clients fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: any) => {
    try {
      setError(null);
      const data = await apiRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      
      // Refresh clients list
      await fetchClients();
      return data.client;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
      throw err;
    }
  };

  // Projects
  const fetchProjects = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await apiRequest('/projects');
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Projects fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    try {
      setError(null);
      const data = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      
      // Refresh projects list
      await fetchProjects();
      return data.project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  // Tasks
  const fetchTasks = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await apiRequest('/tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Tasks fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      setError(null);
      const data = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      
      // Refresh tasks list
      await fetchTasks();
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: any) => {
    try {
      setError(null);
      const data = await apiRequest(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      
      return data.task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  // Threads and Messages
  const fetchThreads = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await apiRequest('/threads');
      setThreads(data.threads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threads');
      console.error('Threads fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      setError(null);
      const data = await apiRequest(`/threads/${threadId}/messages`);
      return data.messages || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Messages fetch error:', err);
      return [];
    }
  };

  const sendMessage = async (threadId: string, messageData: any) => {
    try {
      setError(null);
      const data = await apiRequest(`/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
      
      return data.message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  // Payments
  const fetchPayments = async (projectId: string) => {
    try {
      setError(null);
      const data = await apiRequest(`/projects/${projectId}/payments`);
      return data.payments || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      console.error('Payments fetch error:', err);
      return [];
    }
  };

  const createPayment = async (projectId: string, paymentData: any) => {
    try {
      setError(null);
      const data = await apiRequest(`/projects/${projectId}/payments`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      
      return data.payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    }
  };

  // Initial data loading - only when user is authenticated
  useEffect(() => {
    if (user && accessToken) {
      fetchDashboardStats();
      fetchClients();
      fetchProjects();
      fetchTasks();
      fetchThreads();
    }
  }, [user, accessToken]);

  const contextValue: DataContextType = {
    dashboardStats,
    fetchDashboardStats,
    clients,
    fetchClients,
    createClient,
    projects,
    fetchProjects,
    createProject,
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    threads,
    fetchThreads,
    fetchMessages,
    sendMessage,
    fetchPayments,
    createPayment,
    isLoading,
    error,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}