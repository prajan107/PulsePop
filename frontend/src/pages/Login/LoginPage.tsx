import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toast } from '@/components/common/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Successfully signed in!', 'Welcome back');
      navigate('/profile');
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to log in. Please check your credentials.';
      toast.error(errorMessage, 'Authentication Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'admin@pulsepop.ai', { shouldValidate: true });
    setValue('password', 'AdminSecret123!', { shouldValidate: true });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#6366F1]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center mb-2" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In to PulsePop</h1>
          <p className="text-xs text-[#94A3B8]">Real-time AI Trend Signals & Analytics Platform</p>
        </div>

        <Card className="border-[#1F2937] bg-[#111827]/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Email Address" error={errors.email?.message} required>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
              </FormField>

              <FormField label="Password" error={errors.password?.message} required>
                <Input
                  {...register('password')}
                  type="password"
                  showPasswordToggle
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                />
              </FormField>

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold h-10 shadow-lg shadow-[#6366F1]/20 mt-2"
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-medium text-[#818CF8] hover:underline"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-[#1F2937] pt-4 text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="ml-1 text-[#6366F1] font-semibold hover:underline">
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
