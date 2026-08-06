import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toast } from '@/components/common/Toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully!', 'Welcome aboard');
      navigate('/profile');
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to create account. Email or username may already be in use.';
      toast.error(errorMessage, 'Registration Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4">
      {/* Dynamic Background Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#6366F1]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center mb-2" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-[#94A3B8]">Join PulsePop to monitor AI trends and analytics</p>
        </div>

        <Card className="border-[#1F2937] bg-[#111827]/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Get Started</CardTitle>
            <CardDescription className="text-xs text-[#94A3B8]">
              Fill in your details below to create your PulsePop account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Username" error={errors.username?.message} required>
                <Input
                  {...register('username')}
                  placeholder="johndoe"
                  icon={<User className="h-4 w-4" />}
                />
              </FormField>

              <FormField label="Email Address" error={errors.email?.message} required>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
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

              <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
                <Input
                  {...register('confirmPassword')}
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
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-[#1F2937] pt-4 text-xs text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="ml-1 text-[#6366F1] font-semibold hover:underline">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
