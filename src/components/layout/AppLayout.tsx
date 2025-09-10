import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Kanban, 
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MesProvider } from '../../stores/mesContext';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard, badge: null },
    { id: 'inbox', label: 'Omni-Inbox', icon: MessageSquare, badge: 3 },
    { id: 'clients', label: 'Клиенты', icon: Users, badge: null },
    { id: 'projects', label: 'Проекты', icon: FolderOpen, badge: null },
  { id: 'kanban', label: 'Канбан', icon: Kanban, badge: 5 },
  { id: 'production', label: 'Производство', icon: Kanban, badge: null },
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-xl text-sidebar-foreground">WoodCraft CRM</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => onViewChange('settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
          {/* Search and quick actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск... (⌘K)"
                className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-md text-sm w-80 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </div>
          
          {/* User menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto bg-background">
          <MesProvider>
            {children}
          </MesProvider>
        </main>
      </div>
    </div>
  );
}