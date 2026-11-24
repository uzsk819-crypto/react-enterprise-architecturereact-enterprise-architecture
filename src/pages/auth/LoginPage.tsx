import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { ROUTE_PATHS } from '../../routes/routePaths';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { from?: { pathname: string } } | null;
  const from = locationState?.from?.pathname || ROUTE_PATHS.DASHBOARD;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.admin@enterprise.io',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login failed:', err);
    }
  };

  const setDemoAccount = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setValue('email', 'alex.admin@enterprise.io');
      setValue('password', 'admin1234');
    } else {
      setValue('email', 'jordan.user@enterprise.io');
      setValue('password', 'user1234');
    }
  };

  return (
    <Card className="border border-border/80 shadow-2xl backdrop-blur-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
          EA
        </div>
        <CardTitle className="text-2xl font-extrabold tracking-tight">Enterprise Console</CardTitle>
        <CardDescription className="text-xs">
          Sign in to access your dashboard, management tools, and settings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Quick Demo Credentials Switcher */}
        <div className="mb-6 p-3 rounded-theme bg-surface-hover/70 border border-border">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Select Demo Role</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('admin')}
              className="text-left p-2 rounded-theme bg-surface border border-border hover:border-primary/60 transition-colors"
            >
              <div className="text-xs font-bold text-text-primary">Admin Account</div>
              <div className="text-[10px] text-text-muted">Full RBAC & write rights</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('user')}
              className="text-left p-2 rounded-theme bg-surface border border-border hover:border-primary/60 transition-colors"
            >
              <div className="text-xs font-bold text-text-primary">Standard User</div>
              <div className="text-[10px] text-text-muted">Read-only permissions</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Corporate Email"
            type="email"
            placeholder="name@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-text-secondary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                {...register('rememberMe')}
              />
              <span>Remember this session</span>
            </label>
            <a href="#forgot" className="text-primary hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="mt-2 py-2.5"
          >
            Sign in to Workspace
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default LoginPage;
