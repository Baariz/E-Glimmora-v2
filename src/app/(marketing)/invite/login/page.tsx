'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/shared/Button/Button'
import { Input } from '@/components/shared/Input/Input'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { cn } from '@/lib/utils/cn'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  })

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    setAuthError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        // Fetch session to determine user's domain and redirect appropriately
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        const roles = session?.user?.roles

        if (roles?.b2b) {
          router.push('/portfolio')
        } else if (roles?.admin) {
          router.push('/dashboard')
        } else {
          router.push('/briefing')
        }
      }
    } catch {
      setAuthError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sand-50/30 to-sand-50" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-md space-y-12">
          {/* Header */}
          <ScrollReveal delay={0}>
            <div className="space-y-6 text-center">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-sand-500">
                Welcome Back
              </p>
              <h1 className="font-serif text-4xl text-rose-900 md:text-5xl">
                Sign In
              </h1>
              <p className="mx-auto max-w-sm font-sans text-base leading-relaxed text-sand-600">
                Access your sovereign experience.
              </p>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400 pointer-events-none" />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="Email address"
                    className="pl-10"
                    error={errors.email?.message}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400 pointer-events-none" />
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-10 pr-10"
                    error={errors.password?.message}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-center font-sans text-sm text-rose-600">
                  {authError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-rose-900 text-white hover:bg-rose-800"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </ScrollReveal>

          {/* Bottom links */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-3 text-center">
              <p className="font-sans text-sm text-sand-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/invite"
                  className="text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors"
                >
                  Request Access
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
