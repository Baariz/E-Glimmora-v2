'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/shared/Button/Button'
import { Input } from '@/components/shared/Input/Input'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { fadeUp } from '@/styles/variants/scroll-reveal'
import { cn } from '@/lib/utils/cn'

// Registration form schema with password requirements
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegistrationForm = z.infer<typeof registrationSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [inviteType, setInviteType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: 'onSubmit',
  })

  const password = watch('password', '')

  // Check for invite code in sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCode = sessionStorage.getItem('validatedInviteCode')
      const storedType = sessionStorage.getItem('inviteType') || 'b2c'

      if (!storedCode) {
        // No invite code - redirect back to invite page
        router.push('/invite?error=missing_invite_code')
        return
      }

      setInviteCode(storedCode)
      setInviteType(storedType)
    }
  }, [router])

  const onSubmit = async (data: RegistrationForm) => {
    if (!inviteCode) {
      setError('No invite code found. Please start from the invite page.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Pre-validate invite code against backend before registration
      const validateResponse = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode }),
      })

      const validateResult = await validateResponse.json()

      if (!validateResult.valid) {
        setError(validateResult.error || 'Invite code is no longer valid')
        // Clear sessionStorage and redirect to invite page
        sessionStorage.removeItem('validatedInviteCode')
        sessionStorage.removeItem('inviteType')
        setTimeout(() => router.push('/invite'), 2000)
        return
      }

      // Call signIn with credentials provider in registration mode
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        inviteCode,
        isRegistration: 'true',
        redirect: false,
      })

      if (result?.error) {
        // Parse error for specific messages
        if (result.error.includes('INVITE_INVALID')) {
          const errorMsg = result.error.replace('INVITE_INVALID: ', '')
          setError(errorMsg)
          // Clear sessionStorage and show link to get new invite code
          sessionStorage.removeItem('validatedInviteCode')
          sessionStorage.removeItem('inviteType')
        } else if (result.error.includes('EMAIL_EXISTS')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError('Registration failed. Please try again.')
        }
        return
      }

      if (result?.ok) {
        // Success - clear sessionStorage
        sessionStorage.removeItem('validatedInviteCode')
        sessionStorage.removeItem('inviteType')

        // Show brief success message
        setError(null)

        // Redirect based on invite type
        setTimeout(() => {
          if (inviteType === 'b2c') {
            router.push('/briefing')
          } else if (inviteType === 'b2b') {
            router.push('/portfolio')
          } else if (inviteType === 'admin') {
            router.push('/dashboard')
          } else {
            router.push('/briefing')
          }
        }, 500)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Password requirements display
  const passwordRequirements = [
    { label: 'At least 12 characters', met: password.length >= 12 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ]

  // Don't render form until invite code is loaded
  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <p className="font-sans text-sand-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-white flex items-center justify-center p-6">
      <ScrollReveal variant={fadeUp}>
        <motion.div
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <p className="font-sans text-xs tracking-widest text-sand-400 uppercase mb-2">
              Exclusive Membership
            </p>
            <h1 className="font-serif text-3xl text-rose-900 mb-3">
              Create Your Account
            </h1>
            <div className="inline-block px-3 py-1 bg-sand-100 rounded-full">
              <p className="font-sans text-xs text-sand-600">
                Invited with: <span className="font-medium">{inviteCode.slice(0, 15)}...</span>
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
              initial={{ x: -10 }}
              animate={{ x: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-sans text-sm text-red-600">{error}</p>
              {error.includes('no longer valid') && (
                <a
                  href="/invite"
                  className="font-sans text-sm text-red-700 underline mt-2 block"
                >
                  Get a new invite code
                </a>
              )}
              {error.includes('already exists') && (
                <a
                  href="/invite"
                  className="font-sans text-sm text-red-700 underline mt-2 block"
                >
                  Sign in instead
                </a>
              )}
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="font-serif text-sm font-medium text-rose-900 mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Alexandra Hartford"
                  className={cn(
                    'w-full pl-11 pr-4 py-2.5 font-sans text-base bg-white border border-sand-300 rounded-md',
                    'transition-colors duration-200 placeholder:text-sand-400',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    errors.name && 'border-red-500 focus:ring-red-500'
                  )}
                />
              </div>
              {errors.name && (
                <p className="font-sans text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-serif text-sm font-medium text-rose-900 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="alexandra@example.com"
                  className={cn(
                    'w-full pl-11 pr-4 py-2.5 font-sans text-base bg-white border border-sand-300 rounded-md',
                    'transition-colors duration-200 placeholder:text-sand-400',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    errors.email && 'border-red-500 focus:ring-red-500'
                  )}
                />
              </div>
              {errors.email && (
                <p className="font-sans text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-serif text-sm font-medium text-rose-900 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className={cn(
                    'w-full pl-11 pr-11 py-2.5 font-sans text-base bg-white border border-sand-300 rounded-md',
                    'transition-colors duration-200 placeholder:text-sand-400',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    errors.password && 'border-red-500 focus:ring-red-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="font-sans text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        req.met ? 'bg-green-500' : 'bg-sand-300'
                      )} />
                      <p className={cn(
                        'font-sans text-xs',
                        req.met ? 'text-green-600' : 'text-sand-400'
                      )}>
                        {req.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-serif text-sm font-medium text-rose-900 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className={cn(
                    'w-full pl-11 pr-11 py-2.5 font-sans text-base bg-white border border-sand-300 rounded-md',
                    'transition-colors duration-200 placeholder:text-sand-400',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    errors.confirmPassword && 'border-red-500 focus:ring-red-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="font-sans text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-rose-900 hover:bg-rose-800 text-white"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </motion.div>
      </ScrollReveal>
    </div>
  )
}
