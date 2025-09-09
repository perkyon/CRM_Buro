import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    }
  };

  const createTestAccount = async () => {
    setIsCreatingAccount(true);
    setError('');
    
    try {
      // Create a test account through the server API
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      // First, initialize the database
      console.log('Initializing database...');
      const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-73ccbe73/init-database`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!initResponse.ok) {
        const initError = await initResponse.json().catch(() => ({}));
        console.error('Database initialization failed:', initError);
        // Continue anyway, tables might already exist
      } else {
        console.log('Database initialized successfully');
      }
      
      // Then create the test user
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-73ccbe73/auth/create-test-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: 'manager@woodcraft.ru',
          password: 'password123',
          name: 'Анна Иванова',
          role: 'manager'
        })
      });
      
      if (response.ok) {
        setEmail('manager@woodcraft.ru');
        setPassword('password123');
        setError('');
        // Auto-fill credentials for easy login
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Не удалось создать тестовый аккаунт. Попробуйте войти с существующими данными.');
      }
    } catch (err) {
      console.error('Test account creation error:', err);
      setError('Не удалось создать тестовый аккаунт. Попробуйте войти с существующими данными.');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">WoodCraft CRM</CardTitle>
          <p className="text-muted-foreground">Вход в систему</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@woodcraft.ru"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-muted-foreground mb-3">Демо-режим:</p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={createTestAccount}
                disabled={isCreatingAccount}
              >
                {isCreatingAccount ? 'Создание аккаунта...' : 'Создать тестовый аккаунт'}
              </Button>
              
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Или попробуйте войти с:</strong></p>
                <p>Email: <code>manager@woodcraft.ru</code></p>
                <p>Password: <code>password123</code></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}