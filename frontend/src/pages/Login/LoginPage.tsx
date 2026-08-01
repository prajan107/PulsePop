import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, ArrowRight, Github, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.vance@pulsepop.ai',
      password: 'password123',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 600);
  };

  const handleDemoFill = () => {
    setValue('email', 'alex.vance@pulsepop.ai');
    setValue('password', 'password123');
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-[#0F172A] p-4 selection:bg-[#6366F1]/30">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#6366F1]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] shadow-xl shadow-[#6366F1]/30">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">PulsePop AI</h1>
          <p className="text-xs text-[#94A3B8]">Sign in to access real-time AI trend signals</p>
        </div>

        {/* Login Form Card */}
        <Card className="border-[#1F2937] bg-[#111827]/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">Enter your credentials to manage workspace signals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] mb-1.5 block">Email address</label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail className="h-4 w-4 text-[#94A3B8]" />}
                />
                {errors.email && (
                  <p className="text-[11px] text-[#EF4444] mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#94A3B8]">Password</label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#6366F1] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4 text-[#94A3B8]" />}
                />
                {errors.password && (
                  <p className="text-[11px] text-[#EF4444] mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold h-10 shadow-lg shadow-[#6366F1]/20"
              >
                Sign In to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#1F2937]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#111827] px-2 text-[#64748B] font-semibold">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/')}
                className="border-[#1F2937] text-xs text-[#CBD5E1] hover:bg-[#1F2937]"
              >
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleDemoFill}
                className="border-[#6366F1]/30 bg-[#6366F1]/10 text-xs text-[#818CF8] hover:bg-[#6366F1]/20"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-[#6366F1]" /> Auto-Fill Demo
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-[#1F2937] pt-4 text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <button onClick={() => navigate('/')} className="ml-1 text-[#6366F1] font-semibold hover:underline">
              Request Free Trial
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
